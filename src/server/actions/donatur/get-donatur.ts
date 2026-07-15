"use server";

import { success, failure } from "@/server/actions/action-result";
import { type Result } from "@/types/action";
import { DonorService } from "@/server/services/donor.service";
import { requireAuth } from "@/lib/auth";
import { type DonaturDetailDto } from "@/features/donatur/types";
import { NotFoundError } from "@/lib/errors";

export const getDonaturAction = async (id: string): Promise<Result<DonaturDetailDto>> => {
  try {
    await requireAuth();
    const donor = await DonorService.findById(id);
    if (!donor) {
      throw new NotFoundError("Donatur tidak ditemukan");
    }

    return success(donor);
  } catch (error) {
    return failure(error);
  }
};
