import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { InvalidInputError } from "../utils/error";

const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // abortEarly: false ensures all errors are captured
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      // return res.status(400).json({
      //   message: "Validation failed",
      //   errors: errors,
      // });
      return next(new InvalidInputError({ error: errors }));
    }
    next();
  };
};

export default validateRequest;
