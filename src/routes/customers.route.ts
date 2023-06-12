import CustomerController from "@/controllers/customers.controllers";
import { checkLoggedIn } from "@/validators/checkLoggedIn";
import { checkEmailNotExists } from "@/validators/checkUserEmail";
import { IDSchema } from "@/validators/schemas/Id.schema";
import { RegisterUserSchema } from "@/validators/schemas/User.schema";

import { validateReqBody, validateReqParams } from "@/validators/validate";
import { Router } from "express";

const customerRoutes = (app: Router) => {
  const route = Router();

  app.use("/customers", route);

  route.post(
    "/register-with-email-and-password",
    validateReqBody(RegisterUserSchema),
    checkEmailNotExists,
    CustomerController.createWithEmailAndPassword
  );

  route.get(
    "/:id",
    validateReqParams(IDSchema),
    checkLoggedIn,
    CustomerController.getCustomerById
  );

  //get all
  //update
  //disable
};

export default customerRoutes;
