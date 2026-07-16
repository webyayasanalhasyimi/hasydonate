"use server";

import { requireAuth } from "@/lib/auth";
import { DonationService } from "@/server/services/donation.service";
import { type DonationListItemDto } from "@/features/donation/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

interface SearchDonationOptions {
  readonly cursor?: string | undefined;
  readonly limit?: number | undefined;
}

export const searchDonationsAction = async (
  query: string,
  options: SearchDonationOptions = {}
): Promise<
  Result<{
    readonly items: readonly DonationListItemDto[];
    readonly nextCursor?: string | undefined;
  }>
> => {
  try {
    await requireAuth();
    const limit = options.limit ?? 10;
    const result = await DonationService.search(query, {
      cursor: options.cursor,
      limit,
    });
    return success(result);
  } catch (err) {
    return failure(err);
  }
};
