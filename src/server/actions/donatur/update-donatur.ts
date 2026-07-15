"use server";

import { success, failure } from "@/server/actions/action-result";
import { type Result } from "@/types/action";
import { updateDonorSchema, type UpdateDonorInput } from "@/features/donatur/schemas/update-donatur.schema";
import { DonorService } from "@/server/services/donor.service";
import { requireAuth } from "@/lib/auth";
import { type Donor } from "@prisma/client";
import { ValidationError, ConflictError, NotFoundError } from "@/lib/errors";

export const updateDonaturAction = async (
  id: string,
  input: UpdateDonorInput
): Promise<Result<Donor>> => {
  try {
    const session = await requireAuth();
    const parsedInput = updateDonorSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new ValidationError(
        "Invalid form inputs",
        parsedInput.error.flatten().fieldErrors as unknown as Record<string, unknown>
      );
    }

    // Check if donor exists
    const existingDonor = await DonorService.getById(id);
    if (!existingDonor) {
      throw new NotFoundError("Donatur tidak ditemukan");
    }

    // Check duplicate phone number for other donors
    const existingPhone = await DonorService.findByPhone(parsedInput.data.phoneNumber);
    if (existingPhone && existingPhone.id !== id) {
      throw new ConflictError("Nomor WhatsApp sudah terdaftar pada donatur lain");
    }

    const updatedDonor = await DonorService.update(id, parsedInput.data, session.user.id);
    return success(updatedDonor);
  } catch (error) {
    return failure(error);
  }
};
