"use server";

import { requireAuth } from "@/lib/auth";
import { createDonationSchema, type CreateDonationInput } from "@/features/donation/schemas/create-donation.schema";
import { DonationService } from "@/server/services/donation.service";
import { type DonationDetailDto } from "@/features/donation/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import { ValidationError } from "@/lib/errors";

export const createDonationAction = async (
  input: CreateDonationInput
): Promise<Result<DonationDetailDto>> => {
  try {
    const session = await requireAuth();
    const parsedInput = createDonationSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new ValidationError(
        "Invalid donation inputs",
        parsedInput.error.flatten().fieldErrors as unknown as Record<string, unknown>
      );
    }

    const donation = await DonationService.create(parsedInput.data, session.user.id);
    return success(donation);
  } catch (err) {
    return failure(err);
  }
};
