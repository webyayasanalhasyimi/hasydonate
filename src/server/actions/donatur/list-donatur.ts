"use server";

import { success, failure } from "@/server/actions/action-result";
import { type Result } from "@/types/action";
import { DonorService } from "@/server/services/donor.service";
import { requireAuth } from "@/lib/auth";
import { type DonaturListItemDto } from "@/features/donatur/types";

interface ListDonaturOptions {
  readonly cursor?: string | undefined;
  readonly limit?: number | undefined;
  readonly query?: string | undefined;
}

export const listDonaturAction = async (
  options: ListDonaturOptions = {}
): Promise<
  Result<{
    readonly items: readonly DonaturListItemDto[];
    readonly nextCursor?: string | undefined;
  }>
> => {
  try {
    await requireAuth();
    const limit = options.limit ?? 10;
    const cursor = options.cursor;
    const query = options.query?.trim();

    if (query) {
      const result = await DonorService.search(query, { cursor, limit });
      return success(result);
    }

    const result = await DonorService.paginate({ cursor, limit });
    return success(result);
  } catch (error) {
    return failure(error);
  }
};
export type ListDonaturActionType = typeof listDonaturAction;
export type ListDonaturOptionsType = ListDonaturOptions;
export type ListDonaturResponseType = Awaited<ReturnType<ListDonaturActionType>>;
