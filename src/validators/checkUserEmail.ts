import { Request, Response, NextFunction } from "express";
import UserService from "@/services/User.service";

export const checkEmailNotExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Email must be in one of req.body/req.params/req.query
    const email = req?.body?.email || req?.params?.email || req?.query?.email;

    if (!email?.trim() || typeof email !== "string") {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: "Please provide an email in body/query/params",
        },
      });
    }

    const user = await UserService.getUserByEmail(email);

    if (user.id) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: "User with this email already exists",
        },
      });
    }

    return next();
  } catch (error: any) {
    next();
  }
};
