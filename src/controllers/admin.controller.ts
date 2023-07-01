import { AppError } from "@/utils/APIError";
import { NextFunction, Request, Response } from "express";
import UserService from "@/services/User.service";
import EmailService from "@/services/Email.service";

class AdminController {
  static async createAdmin(req: Request, res: Response, next: NextFunction) {
    return;
  }

  static async updateAdminInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return;
  }

  static async disableAdmin(req: Request, res: Response, next: NextFunction) {
    return;
  }

  static async getAdminById(req: Request, res: Response, next: NextFunction) {
    return;
  }

  static async getAllAdmins(req: Request, res: Response, next: NextFunction) {
    return;
  }
}
