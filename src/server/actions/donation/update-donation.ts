"use server";

import { requireAuth } from "@/lib/auth";
import { updateDonationSchema, type UpdateDonationInput } from "@/features/donation/schemas/update-donation.schema";
import { DonationService } from "@/server/services/donation.service";
import { type DonationDetailDto } from "@/features/donation/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import { ValidationError } from "@/lib/errors";

export const updateDonationAction = async (
  id: string,
  input: UpdateDonationInput
): Promise<Result<DonationDetailDto>> => {
  try {
    await requireAuth();
    const parsedInput = updateDonationSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new ValidationError(
        "Invalid donation inputs",
        parsedInput.error.flatten().fieldErrors as unknown as Record<string, unknown>
      );
    }

    const donation = await DonationService.update(id, parsedInput.data);
    return success(donation);
  } catch (err) {
    return failure(err);
  }
};
