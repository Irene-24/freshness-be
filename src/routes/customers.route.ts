import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "@/validators/validate";
import { NextFunction, Request, Response, Router } from "express";
const route = Router();

export default (app: Router) => {
  app.use("/customers", route);

  route.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({
      data: [],
    });
  });
};
