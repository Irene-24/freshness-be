import EmailService from "@/services/Email.service";
import TokenService from "@/services/Token.service";
import UserService from "@/services/User.service";
import { AppError } from "@/utils/APIError";
import { appendQueryParam } from "@/utils/miscHelpers";
import { NextFunction, Request, Response } from "express";
import config from "@/src/config";

class CustomerController {
  static async createWithEmailAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.customerCreateWithEmailPwd({
        email: req.body.email,
        password: req.body.password,
      });

      if (!config.isTest) {
        const emailToken = await TokenService.generateEmailToken(user.id);

        console.log({
          callbackUrl: appendQueryParam(
            req.body.callbackUrl,
            "token",
            emailToken
          ),
        });
        await EmailService.sendCustomerReg({
          email: user.email,
          name: user.userName || user.email,
          callbackUrl: appendQueryParam(
            req.body.callbackUrl,
            "token",
            emailToken
          ),
        });
      }

      return res.status(201).json({
        message: "Created customer",
        data: user,
      });
    } catch (error: any) {
      next(
        new AppError({
          body: error?.body ?? error,
          statusCode: error?.statusCode ?? 400,
          message: error.message ?? "Error creating customer",
        })
      );
    }
  }

  static async getCustomerById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.getUserById(req.params.id);

      return res.status(200).json({
        message: "Found customer",
        data: user,
      });
    } catch (error: any) {
      next(
        new AppError({
          body: error?.body ?? error,
          statusCode: error?.statusCode ?? 404,
          message: error.message ?? "Unable to find customer",
        })
      );
    }
  }

  //disable customer
  //update customer info

  //get all customers
}

export default CustomerController;
