"use server";

import { requireAuth } from "@/lib/auth";
import { DonationService } from "@/server/services/donation.service";
import { SettingService } from "@/server/services/setting.service";
import { buildReceiptData } from "@/features/receipt/lib/receipt-data-builder";
import { type ReceiptData } from "@/features/receipt/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import { PaymentMethod } from "@prisma/client";

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
    const receiptData = buildReceiptData(donation, settings);

    return success(receiptData);
  } catch (err) {
    return failure(err);
  }
};
