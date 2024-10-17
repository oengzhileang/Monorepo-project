import { Request, Response, NextFunction } from "express";

//import Schema from joi
import { Schema } from "joi";

interface ValidateError {
  message: string;
  type: string;
}

interface JoiError {
  status: string;
  error: {
    original: unknown;
    details: ValidateError[];
  };
}

interface CustomError {
  status: string;
  error: string;
}
// const supportMethod = ["post", "put", "delete"];

const validateOption = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

export function validateSchema(Schema: Schema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // try {
    const { error, value } = Schema.validate(req.body, validateOption);
    if (error) {
      const customError: CustomError = {
        status: "failed",
        error: "Invalid request, Please review request and try again",
      };
      const joiError: JoiError = {
        status: "failed",
        error: {
          original: error?._original,
          details: error?.details.map(({ message, type }: ValidateError) => ({
            message: message.replace(/['']/g, ""),
            type,
          })),
        },
      };
      return res.status(422).json({ joiError, customError });
    }
    req.body = value;
    return next();

    // const { error } = productsSchemaJoi.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }
    // Schema.validate(req.body);
    // next(); //pass request
    // } catch (error) {
    // Handle unexpected errors
    // return res
    //   .status(500)
    //   .json({ message: "An unexpected error occurred", error: error });
    // }
  };
}
