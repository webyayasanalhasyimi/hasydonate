"use server";

import { requireAdmin } from "@/lib/auth";
import { UserService } from "@/server/services/user.service";
import { type UserDetailDto } from "@/features/users/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const toggleUserStatusAction = async (
  id: string,
  isActive: boolean
): Promise<Result<UserDetailDto>> => {
  try {
    const actor = await requireAdmin();
    const actorId = actor.profile.id;

    let user: UserDetailDto;
    if (isActive) {
      user = await UserService.activate(id, actorId);
    } else {
      user = await UserService.deactivate(id, actorId);
    }
    return success(user);
  } catch (err) {
    return failure(err);
  }
};
export type ToggleUserStatusActionType = typeof toggleUserStatusAction;
