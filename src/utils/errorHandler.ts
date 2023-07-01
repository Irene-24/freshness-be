import { ApiError, AppError } from "@/src/utils/APIError";

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

interface IAppErr {
  defaultMsg?: string;
  error: Error & AppError;
  statusCode?: number;
}

const genericAppError = ({ error, defaultMsg, statusCode }: IAppErr) => {
  if (error.body) {
    throw new AppError({
      body: error.body,
      message: error.message || defaultMsg || "Error performing request",
      statusCode,
    });
  }
  throw new AppError({
    body: error,
    message: defaultMsg || "Error performing request",
    statusCode,
  });
};

export {
  errorHandler,
  resourceNotFoundErrorHandler,
  invalidRequestErrorHandler,
  genericAppError,
};
