import { EmailPwdSchema } from "@/validators/schemas/User.schema";
import {
  validateReqBody,
  // validateReqParams,
  // validateReqQuery,
} from "@/validators/validate";
import { NextFunction, Request, Response, Router } from "express";
const route = Router();

const customerRoutes = (app: Router) => {
  app.use("/customers", route);

  route.post(
    "/",
    validateReqBody(EmailPwdSchema),
    (req: Request, res: Response, next: NextFunction) => {
      res.json({
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
