export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: Record<string, unknown> | undefined;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 403, "UNAUTHORIZED");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 409, "CONFLICT", details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "An unexpected error occurred") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}
