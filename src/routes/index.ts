import { Router } from "express";
import customers from "@/routes/customers.route";
import authRoutes from "./auth.route";

export default () => {
  const app = Router();

  authRoutes(app);
  customers(app);

  return app;
};
