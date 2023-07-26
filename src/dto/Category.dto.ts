import { CamelCase } from "@/utils/commonType";
import { Category } from "@/src/db/schemas/Category";

export type CategoryInfo = CamelCase<Category>;

export type CategoryBody = Omit<Category, "id">;
