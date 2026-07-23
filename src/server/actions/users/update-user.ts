"use server";

import { requireAdmin } from "@/lib/auth";
import { UserService } from "@/server/services/user.service";
import { userFormSchema } from "@/features/users/schemas/user.schema";
import { type UserDetailDto } from "@/features/users/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const updateUserAction = async (
  id: string,
  values: unknown
): Promise<Result<UserDetailDto>> => {
  try {
    const actor = await requireAdmin();
    const actorId = actor.profile.id;

    const parsed = userFormSchema.safeParse(values);
    if (!parsed.success) {
      return failure(new Error("Validasi formulir ubah pengguna gagal."));
    }

    const user = await UserService.update(id, parsed.data, actorId);
    return success(user);
  } catch (err) {
    return failure(err);
  }
};
export type UpdateUserActionType = typeof updateUserAction;
