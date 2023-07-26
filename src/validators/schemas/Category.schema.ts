import { z } from "zod";

export const CreateCategorySchema = z
  .object({
    name: z
      .string({
        required_error: "Category name is required",
      })
      .trim(),
    description: z
      .string({
        required_error: "Category description is required",
      })
      .trim(),
  })
  .strip();
