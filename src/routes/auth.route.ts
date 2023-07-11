import AuthController from "@/controllers/auth.controller";
import GitHubController from "@/controllers/github.controller";

import {
  EmailPwdSchema,
  UrlRoleSchema,
} from "@/validators/schemas/User.schema";

import {
  validateReqBody,
  validateReqQuery,
  // validateReqParams,
  // validateReqQuery,
} from "@/validators/validate";
import { /*NextFunction, Request, Response, */ Router } from "express";

const authRoutes = (app: Router) => {
  const route = Router();

  app.use("/auth", route);

  route.post(
    "/customer-password-login",
    validateReqBody(EmailPwdSchema),
    AuthController.loginCustomerWithPassword
  );

  route.post(
    "/merchant-password-login",
    validateReqBody(EmailPwdSchema),
    AuthController.loginMerchantWithPassword
  );

  route.post(
    "/admin-password-login",
    validateReqBody(EmailPwdSchema),
    AuthController.loginAdminWithPassword
  );

  route.post("/verify-email", AuthController.confirmEmailToken);

  route.get("/refresh", AuthController.refreshToken);

  route.get("/github-callback", GitHubController.authoriseUser);

  //init reset password

  //confirm reset password

  route.get(
    "/github",
    validateReqQuery(UrlRoleSchema),
    GitHubController.initiateAuth
  );
};

export default authRoutes;
