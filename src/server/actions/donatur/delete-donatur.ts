"use server";

import { success, failure } from "@/server/actions/action-result";
import { type Result } from "@/types/action";
import { DonorService } from "@/server/services/donor.service";
import { requireAuth } from "@/lib/auth";
import { type Donor } from "@prisma/client";
import { NotFoundError } from "@/lib/errors";

export const deleteDonaturAction = async (id: string): Promise<Result<Donor>> => {
  try {
    const session = await requireAuth();

    // Check if donor exists
    const existingDonor = await DonorService.getById(id);
    if (!existingDonor) {
      throw new NotFoundError("Donatur tidak ditemukan");
    }

    const deletedDonor = await DonorService.softDelete(id, session.user.id);
    return success(deletedDonor);
  } catch (error) {
    return failure(error);
  }
};
