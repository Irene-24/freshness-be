import BaseRespoitory from "@/repo/Base.repo";

import { CategoryInfo, CategoryBody } from "@/dto/Category.dto";

import format from "pg-format";
import { toCamelCase, toCamelCaseRows } from "@/utils/casing";
import { AppError } from "@/utils/APIError";
import { genericAppError } from "@/utils/errorHandler";
import config from "@/src/config";
import { camelToSnake } from "@/utils/miscHelpers";

class CategoryRepository extends BaseRespoitory {
  async create({ name, image_url, description }: CategoryBody) {
    return;
  }

  async update(id: string, { name, image_url, description }: CategoryBody) {
    return;
  }
  async findById(id: string) {
    return;
  }
  async delete(id: string) {
    return;
  }
}

const CategoryRepo = new CategoryRepository();

export default CategoryRepo;
