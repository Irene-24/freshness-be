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

export const pickUserInfo = <T extends UserInfo, K extends UserKeysNoPwd[]>(
  user: T,
  fieldsToAdd: K
): Pick<T, K[number]> => {
  return filterUserInfo(pick(user, fieldsToAdd) as UserInfo) as unknown as Pick<
    T,
    K[number]
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

export const isValidRole = (role: ROLES) => {
  return (
    role === ROLES.ADMIN || role === ROLES.CUSTOMER || role === ROLES.MERCHANT
  );
};
