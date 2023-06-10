import { Request } from "express";
import { UserInfo } from "@/dto/User.dto";

export type NullableType<T> = null | T;

export const enum ROLES {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  MERCHANT = "MERCHANT",
}

export interface CustomReq extends Request {
  user: Omit<UserInfo, "password">;
}

export interface GitHubState {
  siteUrl: string;
  role: Omit<ROLES, ROLES.ADMIN>;
}

export const enum SSO_PROVIDER {
  GITHUB = "GITHUB",
}

export type CamelCaseKey<K extends string> = K extends `${infer L}_${infer R}`
  ? `${Lowercase<L>}${Capitalize<CamelCaseKey<R>>}`
  : K;

export type CamelCase<T> = {
  [K in keyof T as CamelCaseKey<K & string>]: T[K];
};

// export interface User {
//   id: string;

//   first_name: NullableType<string>;
//   last_name: NullableType<string>;
//   hello_t_h_u: string;
//   isBold: boolean;
//   a_B_B_C_c_g:number
// }

// type V = CamelCase<User>;
