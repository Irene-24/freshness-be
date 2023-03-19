import { AppError } from "@/utils/APIError";
import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validateReq =
  (schema: AnyZodObject, key: "body" | "query" | "params") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req[key]);
      return next();
    } catch (error: any) {
      next(
        new AppError({
          body: error,
          statusCode: 400,
          message: `Invalid request ${key}`,
        })
      );
    }
  };

const validateReqBody = (schema: AnyZodObject) => validateReq(schema, "body");

const validateReqParams = (schema: AnyZodObject) =>
  validateReq(schema, "params");

const validateReqQuery = (schema: AnyZodObject) => validateReq(schema, "query");

export { validateReqBody, validateReqQuery, validateReqParams };
