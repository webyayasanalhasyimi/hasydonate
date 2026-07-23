"use server";

import { requireAdmin } from "@/lib/auth";
import { UserService } from "@/server/services/user.service";
import { type UserResultDto } from "@/features/users/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const getUsersAction = async (options: {
  readonly cursor?: string | undefined;
  readonly limit: number;
  readonly query?: string | undefined;
}): Promise<Result<UserResultDto>> => {
  try {
    await requireAdmin();
    const result = await UserService.paginate(options);
    return success(result);
  } catch (err) {
    return failure(err);
  }
};
export type GetUsersActionType = typeof getUsersAction;
