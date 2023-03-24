import { UserInfo } from "@/dto/User.dto";
import UserService from "@/services/User.service";
import { AppError } from "@/utils/APIError";
import { ROLES } from "@/utils/commonType";
import { Request, Response, NextFunction } from "express";

interface CustomReq extends Request {
  user: UserInfo;
}

const checkRole =
  (role: string) =>
  async (req: CustomReq, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError({
          statusCode: 404,
          message: `No user found`,
        })
      );
    }

    if (req.user && req.user.role !== role) {
      return next(
        new AppError({
          statusCode: 403,
          message: `Role ${req.user.role} is not authorized to perform this action`,
        })
      );
    }

    return next();
  };

const checkAdminRole = () => checkRole(ROLES.ADMIN);

const checkCustomerRole = () => checkRole(ROLES.CUSTOMER);

const checkMerchantRole = () => checkRole(ROLES.MERCHANT);

export { checkAdminRole, checkMerchantRole, checkCustomerRole, checkRole };
