import { APP_ERROR_MESSAGE } from "../utils/contants/app-error-message";
import { HTTP_STATUS_CODE } from "../utils/contants/status-code";
import { ApplicationError } from "../utils/error";
import { Request, Response, NextFunction } from "express";

export function GlobalErrorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  //Handle Error
  if (error instanceof ApplicationError) {
    const status = error.status;
    const message = error.message;
    const errors = error.error;
    console.error(`UserService - GlobalErrorHandler() method err ${error}`);
    return res.status(status).json({ message, error: errors });
  }
  console.error(
    `UserService - GlobalErrorHandler() method unexpected error ${error}`
  );
  res
    .status(HTTP_STATUS_CODE.SERVER_ERROR)
    .json({ message: APP_ERROR_MESSAGE.serverError });
}
