import { Request, Response, NextFunction } from "express";

export function requestTime(_req: Request, _res: Response, next: NextFunction) {
  console.log(`Request Time at : ${new Date().toLocaleString()}`);
  next();
}
