import { AppError } from "@/utils/APIError";
import { NextFunction, Request, Response } from "express";
import UserService from "@/services/User.service";
import EmailService from "@/services/Email.service";
import { ROLES, ReqWithUser } from "@/utils/commonType";

class AdminController {
  static async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const admin = await UserService.createAdmin({
        createdBy: (req as ReqWithUser).user.id,
        ...req.body,
      });

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
    try {
      const admin = await UserService.updateUser(req.params.id, req.body);

      return res.status(200).json({
        message: "Updated admin",
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

  static async disableAdmin(
    request: Request,
    res: Response,
    next: NextFunction
  ) {
    const req = request as ReqWithUser;

    //cannot disable self
    // req.user.id !== req.params.id
    return res.json({ message: "coming soon", user: req.user });
  }

  static async getAdminById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id);

      return res.status(200).json({
        message: "Found admin",
        data: user,
      });
    } catch (error: any) {
      next(
        new AppError({
          body: error?.body ?? error,
          statusCode: error?.statusCode ?? 404,
          message: error.message ?? "Unable to find admin",
        })
      );
    }
  }

  static async getAllAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await UserService.getUsersByType(
        ROLES.ADMIN,
        req.query.lastId as string,
        +(req.query.limit || 100),
        req.query.order as "ASC" | "DESC"
      );

      return res.status(200).json({
        message: "Success",
        data: data,
      });
    } catch (error: any) {
      next(
        new AppError({
          body: error?.body ?? error,
          statusCode: error?.statusCode ?? 400,
          message: error.message ?? "Unable to get admins",
        })
      );
    }
  }
}

export default AdminController;
