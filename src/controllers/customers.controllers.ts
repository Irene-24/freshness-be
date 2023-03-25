import AuthService from "@/services/Auth.service";
import UserService from "@/services/User.service";
import { AppError } from "@/utils/APIError";
import { NextFunction, Request, Response } from "express";

class CustomerController {
  static async createWithEmailAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const hashPwd = await AuthService.hashPwd(req.body.password);
      const user = await UserService.customerCreateWithEmailPwd({
        email: req.body.email,
        password: hashPwd,
      });

      return res.status(201).json({
        message: "Created customer",
        data: user,
      });
    } catch (error: any) {
      next(
        new AppError({
          body: error?.body ?? error,
          statusCode: error?.statusCode ?? 400,
          message: error.message ?? "Error creating user",
        })
      );
    }
  }
}

export default CustomerController;
