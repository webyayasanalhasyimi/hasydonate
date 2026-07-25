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

    const receiptData = buildReceiptData(
      donation,
      settings,
      logoUrl,
      receivedBySignatureUrl,
      approvedBySignatureUrl
    );

    return success(receiptData);
  } catch (err) {
    return failure(err);
  }
};
