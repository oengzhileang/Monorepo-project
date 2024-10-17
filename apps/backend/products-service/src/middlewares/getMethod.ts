import { Request, Response, NextFunction } from "express";

export function getMethod(req: Request, _res: Response, next: NextFunction) {
  console.log(`${req.path} ${req.method}`);
  next();
}
