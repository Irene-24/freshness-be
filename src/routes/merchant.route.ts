import MerchantController from "@/controllers/merchant.controller";
import { checkLoggedIn } from "@/validators/checkLoggedIn";

import { checkEmailNotExists } from "@/validators/checkUserEmail";
import { IDSchema } from "@/validators/schemas/Id.schema";
import { EmailPwdSchema } from "@/validators/schemas/User.schema";

import { validateReqBody, validateReqParams } from "@/validators/validate";
import { Router } from "express";

const merchantRoutes = (app: Router) => {
  const route = Router();

  app.use("/merchants", route);

  route.post(
    "/register-with-email-and-password",
    validateReqBody(EmailPwdSchema),
    checkEmailNotExists,
    MerchantController.createWithEmailAndPassword
  );

  route.get(
    "/:id",
    validateReqParams(IDSchema),
    checkLoggedIn,
    MerchantController.getMerchantById
  );

  //get all
  //update
  //disable
};

export default merchantRoutes;
