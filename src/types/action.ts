import { type AppError } from "@/lib/errors";

export type ActionStatus = "idle" | "loading" | "success" | "error";

export type Result<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: AppError };
