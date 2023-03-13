import config from "@/src/config";

export class ApiError extends Error {
  statusCode: number;
  omitStack: boolean;

  constructor(statusCode: number, message: string, omitStack = config.isDev) {
    super(message);

    this.statusCode = statusCode;
    this.omitStack = omitStack || false;
    if (!omitStack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(404, `The requested path ${path} not found!`, true);
  }
}
