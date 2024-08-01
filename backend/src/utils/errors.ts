export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CommonError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "CommonError";
  }
}

export class InternalError extends CustomError {
  constructor(message: string) {
    super(message);
    this.name = "InternalError";
  }
}
