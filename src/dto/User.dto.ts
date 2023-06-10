import { NullableType, ROLES, CamelCase } from "@/utils/commonType";
import { User } from "@/src/db/schemas/User";

export interface UserEmailPwd {
  email: string;
  password: string;
  role: ROLES;
}

export type UserInfo = CamelCase<User>;

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
