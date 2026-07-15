"use server";

import { success, failure } from "@/server/actions/action-result";
import { type Result } from "@/types/action";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/current-user";

export const getCurrentUserAction = async (): Promise<Result<CurrentUser | null>> => {
  try {
    const user = await getCurrentUser();
    return success(user);
  } catch (error) {
    return failure(error);
  }
};
