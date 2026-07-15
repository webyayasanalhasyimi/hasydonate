"use server";

import { success, failure } from "@/server/actions/action-result";
import { type Result } from "@/types/action";
import { loginSchema, type LoginInput } from "@/features/auth/schemas/login.schema";
import { AuthService } from "@/server/services/auth.service";

export const loginAction = async (input: LoginInput): Promise<Result<null>> => {
  try {
    const validatedFields = loginSchema.parse(input);
    await AuthService.login(validatedFields);
    return success(null);
  } catch (error) {
    return failure(error);
  }
};
