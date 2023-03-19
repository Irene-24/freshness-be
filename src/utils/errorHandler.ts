import { ApiError } from "@/src/utils/APIError";
import { Response } from "express";
import { serializeError } from "serialize-error";

const errorHandler = (statusCode: number, err: Error, omitStack?: boolean) => {
  return new ApiError(
    statusCode,
    err.message || "Unable to complete request",
    omitStack
  );
};

const resourceNotFoundErrorHandler = (err: string) => {
  return new ApiError(404, err);
};

const invalidRequestErrorHandler = (err: string) => {
  return new ApiError(400, err);
};

interface Err {
  res: Response;
  error: any;
  statusCode: number;
}

const badRequestErrorHandler = ({ res, error, statusCode }: Err) => {
  return res.status(statusCode || 400).json({
    error: serializeError(error),
  });
};

export {
  errorHandler,
  resourceNotFoundErrorHandler,
  invalidRequestErrorHandler,
  badRequestErrorHandler,
};
