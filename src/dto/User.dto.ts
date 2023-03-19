import { NullableType, ROLES } from "@/utils/commonType";

export interface UserEmailPwd {
  email: string;
  password: string;
  role: ROLES;
}

export interface UserInfo {
  id: string;
  email: string;
  firstName: NullableType<string>;
  lastName: NullableType<string>;
  avatarUrl: NullableType<string>;
  userName: NullableType<string>;
  role: ROLES;
}

export interface AdminInfo extends UserInfo {
  createdBy: NullableType<string>;
}

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
