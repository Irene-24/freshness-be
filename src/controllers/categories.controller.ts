import { NextFunction, Request, Response } from "express";

import CategoryService from "@/services/Category.service";

class CategoryController {
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    console.log({ req });

    return res.json({ message: "Success", data: [] });
  }

  static async getAllCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return res.json({ message: "Success", data: [] });
  }

  static async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return res.json({ message: "Success", data: [] });
  }

  static async disableCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return res.json({ message: "Success", data: [] });
  }

  static async enableCategory(req: Request, res: Response, next: NextFunction) {
    return res.json({ message: "Success", data: [] });
  }
}

export default CategoryController;
