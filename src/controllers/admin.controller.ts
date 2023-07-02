import { AppError } from "@/utils/APIError";
import { NextFunction, Request, Response } from "express";
import UserService from "@/services/User.service";
import EmailService from "@/services/Email.service";

class AdminController {
  static async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await UserService.createAdmin(req.body);

      return res.status(201).json({
        message: "Created admin",
        data: admin,
      });
    } catch (error: any) {
      next(
        new AppError({
          body: error?.body ?? error,
          statusCode: error?.statusCode ?? 400,
          message: error.message ?? "Error creating admin",
        })
      );
    }
  }

  static async updateAdminInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return res.json({ message: "coming soon" });
  }

  static async disableAdmin(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: "coming soon" });
  }

  static async getAdminById(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: "coming soon" });
  }

  static async getAllAdmins(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: "coming soon" });
  }
}

export default AdminController;
