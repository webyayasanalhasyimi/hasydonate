"use server";

import { requireAuth } from "@/lib/auth";
import { DonationService } from "@/server/services/donation.service";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const deleteDonationAction = async (
  id: string
): Promise<Result<void>> => {
  try {
    const actor = await requireAuth();
    const actorId = actor.profile.id;

    await DonationService.delete(id, actorId);
    return success(undefined);
  } catch (err) {
    return failure(err);
  }
};
export type DeleteDonationActionType = typeof deleteDonationAction;
