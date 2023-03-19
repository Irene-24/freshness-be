import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { badRequestErrorHandler } from "@/utils/errorHandler";

const validateReq =
  (schema: AnyZodObject, key: "body" | "query" | "params") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        [key]: req[key],
      });
      return next();
    } catch (error) {
      return badRequestErrorHandler({ statusCode: 400, error, res });
    }
  };

const validateReqBody = (schema: AnyZodObject) => validateReq(schema, "body");

const validateReqParams = (schema: AnyZodObject) =>
  validateReq(schema, "params");

const validateReqQuery = (schema: AnyZodObject) => validateReq(schema, "query");

export { validateReqBody, validateReqQuery, validateReqParams };
