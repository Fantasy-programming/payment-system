/**
 * Custom error class that captures the stack trace.
 * This class is meant to be extended by other, more specific error classes.
 */
export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
