import { CookieOptions, Response } from "express";

function setCookiee(
  response: Response,
  name: string,
  value: string,
  options: CookieOptions = {}
) {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
    maxAge: 3600 * 1000,
    ...options,
  };
  response.cookie(name, value, defaultOptions);
}

export default setCookiee;
