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
    if (!donation.transferProofPath) {
      const errorMsg =
        donation.paymentMethod === PaymentMethod.BANK_TRANSFER
          ? "Transfer proof is required before generating the receipt."
          : "Payment proof is required before generating the receipt.";
      return failure(new Error(errorMsg));
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

    const receiptData = buildReceiptData(donation, settings, logoUrl);

    return success(receiptData);
  } catch (err) {
    return failure(err);
  }
};
