import AuthController from "@/controllers/auth.controller";
import { EmailPwdSchema } from "@/validators/schemas/User.schema";

import {
  validateReqBody,
  // validateReqParams,
  // validateReqQuery,
} from "@/validators/validate";
import { NextFunction, Request, Response, Router } from "express";

const authRoutes = (app: Router) => {
  const route = Router();

  app.use("/auth", route);

  route.post(
    "/customer-password-login",
    validateReqBody(EmailPwdSchema),
    AuthController.loginCustomerWithPassword
  );
};

export default authRoutes;
