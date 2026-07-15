import { type Result } from "@/types/action";
import { AppError, InternalServerError } from "@/lib/errors";

export const success = <T>(data: T): Result<T> => {
  return { success: true, data };
};

export const failure = (error: unknown): Result<never> => {
  if (error instanceof AppError) {
    return { success: false, error };
  }

  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return {
    success: false,
    error: new InternalServerError(message),
  };
};
