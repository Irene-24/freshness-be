import { NullableType, ROLES } from "@/utils/commonType";

export interface User {
  id: string;

  first_name: NullableType<string>;
  last_name: NullableType<string>;

  email: string;
  phone_number: NullableType<string>;
  avatar_url: NullableType<string>;
  user_name: NullableType<string>;

  password: NullableType<string>;
  sso_provider: NullableType<string>;
  sso_provider_user_id: NullableType<string>;

  role: ROLES;

  isEnabled: boolean;
  isVerified: boolean;
  created_by: NullableType<string>;
  created_at: NullableType<string>;
  updated_at: NullableType<string>;
}
