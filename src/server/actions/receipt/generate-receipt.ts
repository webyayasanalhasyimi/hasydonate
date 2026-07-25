"use server";

import { requireAuth } from "@/lib/auth";
import { DonationService } from "@/server/services/donation.service";
import { SettingService } from "@/server/services/setting.service";
import { buildReceiptData } from "@/features/receipt/lib/receipt-data-builder";
import { type ReceiptData } from "@/features/receipt/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import { PaymentMethod } from "@prisma/client";
import { getSignedUrl } from "@/lib/storage/signed-url";

async function buildQrDataUrl(url: string): Promise<string | undefined> {
  try {
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) return undefined;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch {
    return undefined;
  }
}

async function resolveSignedUrls(
  donation: Awaited<ReturnType<typeof DonationService.findById>>,
  settings: Awaited<ReturnType<typeof SettingService.getAll>>
) {
  let logoUrl: string | undefined = undefined;
  const foundLogoSetting = settings.find((s) => s.key === "foundation.logoPath");
  if (foundLogoSetting?.value) {
    try {
      const parts = foundLogoSetting.value.split("/");
      const bucket = parts[0] ?? "foundation-assets";
      const cleanPath = parts.slice(1).join("/");
      logoUrl = await getSignedUrl(bucket, cleanPath);
    } catch {
      // Silent catch
    }
  }

  let receivedBySignatureUrl: string | undefined = undefined;
  if (donation?.receivedBySignaturePath) {
    try {
      const parts = donation.receivedBySignaturePath.split("/");
      const bucket = parts[0] ?? "foundation-assets";
      const cleanPath = parts.slice(1).join("/");
      receivedBySignatureUrl = await getSignedUrl(bucket, cleanPath);
    } catch {
      // Silent catch
    }
  }

  let approvedBySignatureUrl: string | undefined = undefined;
  const foundSignatureSetting = settings.find((s) => s.key === "foundation.signaturePath");
  if (foundSignatureSetting?.value) {
    try {
      const parts = foundSignatureSetting.value.split("/");
      const bucket = parts[0] ?? "foundation-assets";
      const cleanPath = parts.slice(1).join("/");
      approvedBySignatureUrl = await getSignedUrl(bucket, cleanPath);
    } catch {
      // Silent catch
    }
  }

  let approvedByStampUrl: string | undefined = undefined;
  const foundStampSetting = settings.find((s) => s.key === "foundation.stampPath");
  if (foundStampSetting?.value) {
    try {
      const parts = foundStampSetting.value.split("/");
      const bucket = parts[0] ?? "foundation-assets";
      const cleanPath = parts.slice(1).join("/");
      approvedByStampUrl = await getSignedUrl(bucket, cleanPath);
    } catch {
      // Silent catch
    }
  }

  return { logoUrl, receivedBySignatureUrl, approvedBySignatureUrl, approvedByStampUrl };
}

export const generateReceiptAction = async (donationId: string): Promise<Result<ReceiptData>> => {
  try {
    await requireAuth();

    const donation = await DonationService.findById(donationId);
    if (!donation) {
      return failure(new Error("Donation data could not be found."));
    }

    // Business validation
    if (donation.paymentMethod === PaymentMethod.BANK_TRANSFER && !donation.transferProofPath) {
      return failure(new Error("Transfer proof is required before generating the receipt."));
    }

    const settings = await SettingService.getAll();
    const { logoUrl, receivedBySignatureUrl, approvedBySignatureUrl, approvedByStampUrl } =
      await resolveSignedUrls(donation, settings);

    const receiptData = buildReceiptData(
      donation,
      settings,
      logoUrl,
      receivedBySignatureUrl,
      approvedBySignatureUrl,
      approvedByStampUrl
    );

    const qrCodeDataUrl = receiptData.verificationUrl
      ? await buildQrDataUrl(receiptData.verificationUrl)
      : undefined;

    return success({ ...receiptData, qrCodeDataUrl });
  } catch (err) {
    return failure(err);
  }
};

export const getPublicReceiptAction = async (donationIdOrNumber: string): Promise<Result<ReceiptData>> => {
  try {
    // Try by donation number first — public receipt URLs use donation number (e.g. AH-DON-20262507-0002)
    let donation = await DonationService.getByDonationNumber(donationIdOrNumber);

    // Fall back to UUID lookup only if the input matches a UUID format
    if (!donation) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(donationIdOrNumber)) {
        donation = await DonationService.findById(donationIdOrNumber);
      }
    }

    if (!donation) {
      return failure(new Error("Donation data could not be found."));
    }

    const settings = await SettingService.getAll();
    const { logoUrl, receivedBySignatureUrl, approvedBySignatureUrl, approvedByStampUrl } =
      await resolveSignedUrls(donation, settings);

    const receiptData = buildReceiptData(
      donation,
      settings,
      logoUrl,
      receivedBySignatureUrl,
      approvedBySignatureUrl,
      approvedByStampUrl
    );

    const qrCodeDataUrl = receiptData.verificationUrl
      ? await buildQrDataUrl(receiptData.verificationUrl)
      : undefined;

    return success({ ...receiptData, qrCodeDataUrl });
  } catch (err) {
    return failure(err);
  }
};
