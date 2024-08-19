/**
 * Custom error class that captures the stack trace.
 * This class is meant to be extended by other, more specific error classes.
 */
export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Unauthorized error class for handling unauthorized errors.
 */
export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Internal error class for handling internal server errors.
 */
export class InternalError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "InternalError";
  }
}
