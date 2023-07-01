import { AppError } from "@/utils/APIError";
import { ROLES } from "@/utils/commonType";
import { Response, NextFunction } from "express";

import { CustomReq } from "@/utils/commonType";

const checkRole =
  (role: string) =>
  async (req: CustomReq, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
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
