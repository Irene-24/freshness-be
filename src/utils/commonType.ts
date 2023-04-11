import { Request } from "express";
import { UserInfo } from "@/dto/User.dto";

export type NullableType<T> = null | T;

export const enum ROLES {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  MERCHANT = "MERCHANT",
}

export interface CustomReq extends Request {
  user: UserInfo;
}

export interface GitHubState {
  siteUrl: string;
  site: Omit<ROLES, ROLES.ADMIN>;
}

export const enum SSO_PROVIDER {
  GITHUB = "GITHUB",
}
