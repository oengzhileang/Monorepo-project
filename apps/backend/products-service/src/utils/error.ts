import { HTTP_STATUS_CODE } from "./contants/status-code";

export class ApplicationError extends Error {
  public readonly status: number;
  public error?: {};
  constructor({
    message,
    status,
    error,
  }: {
    message: string;
    status: number;
    error?: {};
  }) {
    super(message);
    this.status = status;
    this.error = error;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

//=========================

//   Client Error

//=========================

export class InvalidInputError extends ApplicationError {
  constructor({
    message = "Invalid input",
    error,
  }: {
    message?: string;
    error?: {};
  }) {
    super({ message, status: HTTP_STATUS_CODE.BAD_REQUEST, error });
  }
}

//handle not found
export class NotFoundError extends ApplicationError {
  constructor({ message = "The requested resource was not found" }) {
    super({ message, status: HTTP_STATUS_CODE.NOT_FOUND });
  }
}

//Authentication error
export class AuthenticationError extends ApplicationError {
  constructor({
    message = "Authentication failed, Please check your credentails",
  }) {
    super({ message, status: HTTP_STATUS_CODE.UNAUTHORIZED });
  }
}

//Authorization error
export class AuthorizationError extends ApplicationError {
  constructor({
    message = "You don't have permission to access this resource",
  }) {
    super({ message, status: HTTP_STATUS_CODE.FORBIDDEN });
  }
}

//ResourceConflict Error
export class ResourceConflictError extends ApplicationError {
  constructor(
    message = "Resource conflict occurred. The resource might already exist."
  ) {
    super({ message, status: HTTP_STATUS_CODE.CONFLICT });
  }
}

// ========================
// Server Error
// ========================

export class InternalServerError extends ApplicationError {
  constructor({
    message = "Internal server error occured",
    error,
  }: {
    message: string;
    error?: {};
  }) {
    super({ message, status: HTTP_STATUS_CODE.SERVER_ERROR, error });
  }
}
