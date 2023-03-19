import { ApiError } from "@/src/utils/APIError";

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

export {
  errorHandler,
  resourceNotFoundErrorHandler,
  invalidRequestErrorHandler,
};
