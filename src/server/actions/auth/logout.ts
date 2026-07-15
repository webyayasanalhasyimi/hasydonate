"use server";

import { success, failure } from "@/server/actions/action-result";
import { type Result } from "@/types/action";
import { AuthService } from "@/server/services/auth.service";

export const logoutAction = async (): Promise<Result<null>> => {
  try {
    await AuthService.logout();
    return success(null);
  } catch (error) {
    return failure(error);
  }
};
