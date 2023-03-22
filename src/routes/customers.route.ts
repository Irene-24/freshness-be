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
    "/",
    validateReqBody(EmailPwdSchema),
    (req: Request, res: Response, next: NextFunction) => {
      res.status(201).json({
        message: "Created customer",
      });
    }
  );

  route.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({
      data: [],
    });
  });
};

export default customerRoutes;
