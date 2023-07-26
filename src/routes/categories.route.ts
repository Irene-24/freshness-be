import { Router } from "express";
import { IDSchema } from "@/validators/schemas/Id.schema";
import { validateReqBody, validateReqParams } from "@/validators/validate";
import CategoryController from "@/controllers/categories.controller";
import { CreateCategorySchema } from "@/validators/schemas/Category.schema";
import { checkLoggedIn } from "@/validators/checkLoggedIn";
import { checkAdminRole } from "@/validators/checkUserRole";
import { checkMixedImages } from "@/validators/imageValidation";

const categoryRoutes = (app: Router) => {
  const route = Router();

  app.use("/categories", route);

  route.post(
    "/",
    validateReqBody(CreateCategorySchema),
    checkMixedImages([{ name: "imageFile", maxCount: 1 }], "categories"),
    // checkLoggedIn,
    // checkAdminRole,
    CategoryController.createCategory
  );

  route.get(
    "/:id",
    validateReqParams(IDSchema),

    CategoryController.getCategoryById
  );

  route.get("/", CategoryController.getAllCategories);
};

export default categoryRoutes;
