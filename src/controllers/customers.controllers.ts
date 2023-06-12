import EmailService from "@/services/Email.service";
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
      const user = await UserService.customerCreateWithEmailPwd({
        email: req.body.email,
        password: req.body.password,
      });

      //await EmailService.sendCustomerReg()

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
