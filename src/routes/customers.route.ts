import CustomerController from "@/controllers/customers.controllers";
import { CustomReq } from "@/utils/commonType";
import { checkLoggedIn } from "@/validators/checkLoggedIn";
import { checkEmailNotExists } from "@/validators/checkUserEmail";
import { EmailPwdSchema } from "@/validators/schemas/User.schema";
import {
  validateReqBody,
  // validateReqParams,
  // validateReqQuery,
} from "@/validators/validate";
import { NextFunction, Request, Response, Router } from "express";

const customerRoutes = (app: Router) => {
  const route = Router();

  app.use("/customers", route);

  route.post(
    "/register-with-email-and-password",
    validateReqBody(EmailPwdSchema),
    checkEmailNotExists,
    CustomerController.createWithEmailAndPassword
  );

  route.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({});
  });

  //deleet later
  route.get(
    "/protected",
    checkLoggedIn,
    (req: Request, res: Response, next: NextFunction) => {
      res.json({ user: (req as CustomReq).user });
    }
  );
};

export default customerRoutes;
