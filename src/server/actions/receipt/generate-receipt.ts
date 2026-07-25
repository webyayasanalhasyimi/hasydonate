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
import QRCode from "qrcode";

export const generateReceiptAction = async (donationId: string): Promise<Result<ReceiptData>> => {
  try {
    await requireAuth();

    const donation = await DonationService.findById(donationId);
    if (!donation) {
      return failure(new Error("Donation data could not be found."));
    }

    // Business validation (06-receipt.md section Validation)
    if (donation.paymentMethod === PaymentMethod.BANK_TRANSFER && !donation.transferProofPath) {
      return failure(new Error("Transfer proof is required before generating the receipt."));
    }

    const settings = await SettingService.getAll();

    // Resolve signed URL for the foundation logo if it exists
    let logoUrl: string | undefined = undefined;
    const foundLogoSetting = settings.find((s) => s.key === "foundation.logoPath");
    if (foundLogoSetting?.value) {
      try {
        const parts = foundLogoSetting.value.split("/");
        const bucket = parts[0] ?? "foundation-assets";
        const cleanPath = parts.slice(1).join("/");
        logoUrl = await getSignedUrl(bucket, cleanPath);
      } catch {
        // Silent catch for missing or invalid storage path
      }
    }

    // Resolve signed URL for the receiver signature if it exists
    let receivedBySignatureUrl: string | undefined = undefined;
    if (donation.receivedBySignaturePath) {
      try {
        const parts = donation.receivedBySignaturePath.split("/");
        const bucket = parts[0] ?? "foundation-assets";
        const cleanPath = parts.slice(1).join("/");
        receivedBySignatureUrl = await getSignedUrl(bucket, cleanPath);
      } catch {
        // Silent catch
      }
    }

    // Resolve signed URL for the approved by signature if it exists
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

    // Resolve signed URL for the approved by stamp if it exists
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

    const receiptData = buildReceiptData(
      donation,
      settings,
      logoUrl,
      receivedBySignatureUrl,
      approvedBySignatureUrl,
      approvedByStampUrl
    );

    let qrCodeDataUrl: string | undefined = undefined;
    if (receiptData.verificationUrl) {
      try {
        const svgString = await QRCode.toString(receiptData.verificationUrl, {
          type: "svg",
          margin: 1,
        });
        qrCodeDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
      } catch (err) {
        console.error("QR Code generation error:", err);
      }
    }

    return success({
      ...receiptData,
      qrCodeDataUrl,
    });
  } catch (err) {
    return failure(err);
  }
};

export const getPublicReceiptAction = async (donationIdOrNumber: string): Promise<Result<ReceiptData>> => {
  try {
    let donation = await DonationService.findById(donationIdOrNumber);
    if (!donation) {
      donation = await DonationService.getByDonationNumber(donationIdOrNumber);
    }
    if (!donation) {
      return failure(new Error("Donation data could not be found."));
    }

    // Business validation (06-receipt.md section Validation)
    if (donation.paymentMethod === PaymentMethod.BANK_TRANSFER && !donation.transferProofPath) {
      return failure(new Error("Transfer proof is required before generating the receipt."));
    }

    const settings = await SettingService.getAll();

    // Resolve signed URL for the foundation logo if it exists
    let logoUrl: string | undefined = undefined;
    const foundLogoSetting = settings.find((s) => s.key === "foundation.logoPath");
    if (foundLogoSetting?.value) {
      try {
        const parts = foundLogoSetting.value.split("/");
        const bucket = parts[0] ?? "foundation-assets";
        const cleanPath = parts.slice(1).join("/");
        logoUrl = await getSignedUrl(bucket, cleanPath);
      } catch {
        // Silent catch for missing or invalid storage path
      }
    }

    // Resolve signed URL for the receiver signature if it exists
    let receivedBySignatureUrl: string | undefined = undefined;
    if (donation.receivedBySignaturePath) {
      try {
        const parts = donation.receivedBySignaturePath.split("/");
        const bucket = parts[0] ?? "foundation-assets";
        const cleanPath = parts.slice(1).join("/");
        receivedBySignatureUrl = await getSignedUrl(bucket, cleanPath);
      } catch {
        // Silent catch
      }
    }

    // Resolve signed URL for the approved by signature if it exists
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

    // Resolve signed URL for the approved by stamp if it exists
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

    const receiptData = buildReceiptData(
      donation,
      settings,
      logoUrl,
      receivedBySignatureUrl,
      approvedBySignatureUrl,
      approvedByStampUrl
    );

    let qrCodeDataUrl: string | undefined = undefined;
    if (receiptData.verificationUrl) {
      try {
        const svgString = await QRCode.toString(receiptData.verificationUrl, {
          type: "svg",
          margin: 1,
        });
        qrCodeDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
      } catch (err) {
        console.error("QR Code generation error:", err);
      }
    }

    return success({
      ...receiptData,
      qrCodeDataUrl,
    });
  } catch (err) {
    return failure(err);
  }
};

