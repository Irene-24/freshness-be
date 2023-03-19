import { Router } from "express";
import customers from "@/routes/customers.route";

export default () => {
  const app = Router();

  customers(app);

  return app;
};
