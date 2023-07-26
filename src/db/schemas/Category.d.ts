import { NullableType } from "@/utils/commonType";
import { Thing } from "./Thing";

export interface Category extends Thing {
  description: string;
  image_url?: NullableType<string>;
}
