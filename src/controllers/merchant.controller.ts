import { AppError } from "@/utils/APIError";
import { NextFunction, Request, Response } from "express";
import UserService from "@/services/User.service";
import EmailService from "@/services/Email.service";

class MerchantController {
  static async createWithEmailAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.merchantCreateWithEmailPwd({
        email: req.body.email,
        password: req.body.password,
      });

      //await EmailService.sendMerchantReg()

      return res.status(201).json({
        message: "Created merchant",
        data: user,
      });
    } catch (error: any) {
      next(
        new AppError({
          body: error?.body ?? error,
          statusCode: error?.statusCode ?? 400,
          message: error.message ?? "Error creating merchant",
        })
      );
    }
  }

  static async getMerchantById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.getUserById(req.params.id);

      return res.status(200).json({
        message: "Found merchant",
        data: user,
      });
    } catch (error: any) {
      next(
        new AppError({
          body: error?.body ?? error,
          statusCode: error?.statusCode ?? 404,
          message: error.message ?? "Unable to find merchant",
        })
      );
    }
  }
}

export default MerchantController;
