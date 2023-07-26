import AdminController from "@/controllers/admin.controller";
import { checkLoggedIn } from "@/validators/checkLoggedIn";
import { checkEmailNotExists } from "@/validators/checkUserEmail";
import { checkAdminRole } from "@/validators/checkUserRole";
import { IDSchema } from "@/validators/schemas/Id.schema";
import {
  CreateAdminSchema,
  UpdateUserSchema,
} from "@/validators/schemas/User.schema";

import { validateReqBody, validateReqParams } from "@/validators/validate";
import { Router } from "express";

const adminRoutes = (app: Router) => {
  const route = Router();

  route.get("/", checkLoggedIn, checkAdminRole, AdminController.getAllAdmins);

  route.post(
    "/create",
    validateReqBody(CreateAdminSchema),
    checkEmailNotExists,
    checkLoggedIn,
    checkAdminRole,
    AdminController.createAdmin
  );

  route.get(
    "/:id",
    validateReqParams(IDSchema),
    checkLoggedIn,
    AdminController.getAdminById
  );

  route.put(
    "/:id",
    validateReqParams(IDSchema),
    validateReqBody(UpdateUserSchema),
    checkLoggedIn,
    checkAdminRole,
    AdminController.updateAdminInfo
  );

  //disable
  route.delete(
    "/:id",
    validateReqParams(IDSchema),
    checkLoggedIn,
    checkAdminRole,
    AdminController.disableAdmin
  );

  //enable
  route.patch(
    "/:id",
    validateReqParams(IDSchema),
    checkLoggedIn,
    checkAdminRole,
    AdminController.enableAdmin
  );
};

export default adminRoutes;
