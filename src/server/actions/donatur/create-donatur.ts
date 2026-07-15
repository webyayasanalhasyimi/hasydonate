"use server";

import { success, failure } from "@/server/actions/action-result";
import { type Result } from "@/types/action";
import { createDonorSchema, type CreateDonorInput } from "@/features/donatur/schemas/create-donatur.schema";
import { DonorService } from "@/server/services/donor.service";
import { requireAuth } from "@/lib/auth";
import { type Donor } from "@prisma/client";
import { ValidationError, ConflictError } from "@/lib/errors";

export const createDonaturAction = async (input: CreateDonorInput): Promise<Result<Donor>> => {
  try {
    const session = await requireAuth();
    const parsedInput = createDonorSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new ValidationError(
        "Invalid form inputs",
        parsedInput.error.flatten().fieldErrors as unknown as Record<string, unknown>
      );
    }

    // Check duplicate phone number
    const existing = await DonorService.findByPhone(parsedInput.data.phoneNumber);
    if (existing) {
      throw new ConflictError("Nomor WhatsApp sudah terdaftar");
    }

    const newDonor = await DonorService.create(parsedInput.data, session.user.id);
    return success(newDonor);
  } catch (error) {
    return failure(error);
  }
};
