import TokenService from "@/services/Token.service";
import UserService from "@/services/User.service";
import { AppError } from "@/utils/APIError";
import { Request, Response, NextFunction } from "express";
import { CustomReq } from "@/utils/commonType";
import { UserInfo } from "@/dto/User.dto";

export const checkLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader?.toLowerCase()?.includes("bearer")) {
    return next(
      new AppError({
        message: "Unauthorized",
        statusCode: 401,
      })
    );
  }

  try {
    const token = authHeader.split(" ")[1];
    const userId = await TokenService.validateJWT(token);

    const user = (await UserService.getUserById(userId)) as UserInfo;

    (req as CustomReq).user = user;

    return next();
  } catch (error: any) {
    return next(
      new AppError({
        message: error?.message ?? "Unauthorized",
        statusCode: error?.statusCode ?? 401,
        body: error?.body ?? error,
      })
    );
  }
};
