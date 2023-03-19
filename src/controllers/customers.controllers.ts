import UserService from "@/services/User.service";
import { NextFunction, Request, Response } from "express";

class CustomerController {
  static async createCustomerWithEmailAndPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const newUser = await UserService.customerCreateWithEmailPwd(req.body);
    } catch (error) {
      next(error);
    }
  }
}

export default CustomerController;
