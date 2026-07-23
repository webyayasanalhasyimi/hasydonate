export type ActionStatus = "idle" | "loading" | "success" | "error";

export interface SerializedAppError {
  readonly message: string;
  readonly statusCode: number;
  readonly code: string;
  readonly details?: Record<string, unknown> | undefined;
}

export type Result<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: SerializedAppError };
