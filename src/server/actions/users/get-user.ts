"use server";

import { requireAdmin } from "@/lib/auth";
import { UserService } from "@/server/services/user.service";
import { type UserDetailDto } from "@/features/users/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const getUserAction = async (id: string): Promise<Result<UserDetailDto | null>> => {
  try {
    await requireAdmin();
    const user = await UserService.findById(id);
    return success(user);
  } catch (err) {
    return failure(err);
  }
};
export type GetUserActionType = typeof getUserAction;
