import { UserInfo } from "@/dto/User.dto";
import { omit, pick } from "./miscHelpers";
import { ROLES } from "./commonType";

export type UserKeys = keyof UserInfo;
export type UserKeysNoPwd = Exclude<UserKeys, "password">;

export const passwordFilter = (user: UserInfo) => {
  return omit(user, ["password"]);
};

/**
 *
 * @param user
 * @param otherFieldsToRemove
 * @returns A user object without the password field as well as the without the 'therFieldsToRemove ' properties
 */

export const filterUserInfo = <T extends UserInfo>(
  user: T,
  otherFieldsToRemove?: UserKeysNoPwd[]
): Omit<T, "password"> => {
  return omit(user as UserInfo, [
    "password",
    ...(otherFieldsToRemove?.length ? otherFieldsToRemove : []),
  ]) as Omit<T, "password">;
};

export const pickUserInfo = <T extends UserInfo>(
  user: T,
  fieldsToAdd: UserKeysNoPwd[]
): Omit<T, "password"> => {
  return filterUserInfo(pick(user, fieldsToAdd) as UserInfo) as Omit<
    T,
    "password"
  >;
};

export const isCustomer = (role: ROLES) => {
  return role === ROLES.CUSTOMER;
};

export const isMerchant = (role: ROLES) => {
  return role === ROLES.MERCHANT;
};

export const isAdmin = (role: ROLES) => {
  return role === ROLES.ADMIN;
};
