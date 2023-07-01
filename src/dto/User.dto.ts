import { NullableType, ROLES, CamelCase } from "@/utils/commonType";
import { User } from "@/src/db/schemas/User";

export interface UserEmailPwd {
  email: string;
  password: string;
  role: ROLES;
}

export type UserInfo = CamelCase<User>;

export type AdminInfo = Omit<
  CamelCase<User>,
  "sso_provider" | "sso_provider_user_id" | "avatar_url"
>;

export type AdminCreateBody = Omit<
  AdminInfo,
  "id" | "role" | "isEnabled" | "isVerified" | "createdAt" | "updatedAt"
>;

export interface GithHubUserInfo {
  id: string | number;
  login: string; //username
  avatar_url: NullableType<string>;
}

export interface GithHubUserEmail {
  email: string;
  primary: boolean;
}

export interface GithHubUser extends GithHubUserInfo {
  email: string;
  role: ROLES;
}
