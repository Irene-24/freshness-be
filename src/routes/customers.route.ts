import CustomerController from "@/controllers/customers.controllers";
import UserService from "@/services/User.service";
import { AppError } from "@/utils/APIError";
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
    res.json({
      data: [],
    });
  });
};

export default customerRoutes;
