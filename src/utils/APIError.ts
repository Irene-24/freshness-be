import config from "@/src/config";

export class ApiError extends Error {
  statusCode: number;
  omitStack: boolean;
  body: Record<string, any> | undefined;

  constructor(
    statusCode: number,
    message: string,
    omitStack = config.isDev,
    body?: Record<string, any>
  ) {
    super(message);

    this.statusCode = statusCode;
    this.omitStack = omitStack || false;
    this.body = body;
    if (!omitStack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

interface AppErrProps {
  statusCode?: number;
  body?: Record<string, any>;
  message: string;
}

export class AppError extends Error {
  statusCode: number;
  body: Record<string, any> | undefined | any;

  constructor({ body, statusCode, message }: AppErrProps) {
    super(message);

    this.statusCode = statusCode || 500;
    this.body = body;
  }
}

export class NotFoundError extends ApiError {
  constructor(path: string) {
    super(404, `The requested path ${path} not found!`, true);
  }
}
