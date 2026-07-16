"use server";

import { requireAuth } from "@/lib/auth";
import { DonationService } from "@/server/services/donation.service";
import { type DonationDetailDto } from "@/features/donation/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import { NotFoundError } from "@/lib/errors";

export const getDonationAction = async (
  id: string
): Promise<Result<DonationDetailDto>> => {
  try {
    await requireAuth();
    const donation = await DonationService.findById(id);
    if (!donation) {
      throw new NotFoundError("Donasi tidak ditemukan");
    }
    return success(donation);
  } catch (err) {
    return failure(err);
  }
};
