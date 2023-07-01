import { z } from "zod";

const IDSchema = z.object({
  id: z.string({ required_error: "Please provide an id" }),
});

export { IDSchema };
