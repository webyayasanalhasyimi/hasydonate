"use server";

import { requireAdmin } from "@/lib/auth";
import { UserService } from "@/server/services/user.service";
import { userFormSchema } from "@/features/users/schemas/user.schema";
import { type UserDetailDto } from "@/features/users/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const createUserAction = async (values: unknown): Promise<Result<UserDetailDto>> => {
  try {
    const actor = await requireAdmin();
    const actorId = actor.profile.id;

    const parsed = userFormSchema.safeParse(values);
    if (!parsed.success) {
      return failure(new Error("Validasi formulir tambah pengguna gagal."));
    }

    // Require password for new user creation
    if (!parsed.data.password) {
      return failure(new Error("Kata sandi awal wajib diisi untuk pengguna baru."));
    }

    const user = await UserService.create(parsed.data, actorId);
    return success(user);
  } catch (err) {
    return failure(err);
  }
};
export type CreateUserActionType = typeof createUserAction;
