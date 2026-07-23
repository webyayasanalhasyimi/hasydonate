import { type Result } from "@/types/action";
import { AppError } from "@/lib/errors";

export const success = <T>(data: T): Result<T> => {
  return { success: true, data };
};

export const failure = (error: unknown): Result<never> => {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
        details: error.details,
      },
    };
  }

  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return {
    success: false,
    error: {
      message,
      statusCode: 500,
      code: "INTERNAL_SERVER_ERROR",
    },
  };
};
