"use server";

import { requireAuth } from "@/lib/auth";
import { DonationService } from "@/server/services/donation.service";
import { type DonationListItemDto } from "@/features/donation/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

interface ListDonationOptions {
  readonly cursor?: string | undefined;
  readonly limit?: number | undefined;
  readonly query?: string | undefined;
}

export const listDonationsAction = async (
  options: ListDonationOptions = {}
): Promise<
  Result<{
    readonly items: readonly DonationListItemDto[];
    readonly nextCursor?: string | undefined;
  }>
> => {
  try {
    await requireAuth();
    const limit = options.limit ?? 10;
    const result = await DonationService.paginate({
      cursor: options.cursor,
      limit,
      query: options.query,
    });
    return success(result);
  } catch (err) {
    return failure(err);
  }
};
