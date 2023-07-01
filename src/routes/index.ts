import { Router } from "express";
import customers from "@/routes/customers.route";
import authRoutes from "@/routes/auth.route";
import merchantRoutes from "@/routes/merchant.route";
import adminRoutes from "@/routes/admin.route";

export default () => {
  const app = Router();

  authRoutes(app);
  customers(app);
  merchantRoutes(app);
  adminRoutes(app);

  return app;
};
