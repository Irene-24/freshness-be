import UserRepo from "@/repo/User.repo";
import {
  UpdateUserBody,
  UserWithEmailPwdSchema,
} from "@/validators/schemas/User.schema";
import { ROLES, SSO_PROVIDER } from "@/utils/commonType";
import { AppError } from "@/utils/APIError";
import { genericAppError } from "@/utils/errorHandler";
import { hashPwd } from "@/utils/password";
import {
  AdminCreateBody,
  AdminInfo,
  GithHubUser,
  UserEmailPwd,
} from "@/dto/User.dto";
import {
  filterUserInfo,
  isCustomer,
  isMerchant,
  isValidRole,
  pickUserInfo,
  UserKeysNoPwd,
} from "@/utils/user";
import config from "@/src/config";

class UserService {
  private static async registerWithEmailPwd(body: UserEmailPwd) {
    try {
      await UserWithEmailPwdSchema.parseAsync(body);
      const password = await hashPwd(body.password);

      const updatedBody = {
        ...body,
        password,
      };

      const newUser = await UserRepo.create(updatedBody);

      return newUser;
    } catch (error: any) {
      return genericAppError({
        error,
        defaultMsg:
          error?.message || "Unable to create user with password and email",
      });
    }
  }

  static async customerCreateWithEmailPwd(body: Omit<UserEmailPwd, "role">) {
    const user = await this.registerWithEmailPwd({
      ...body,
      role: ROLES.CUSTOMER,
    });

    return filterUserInfo(user, ["createdBy"]);
  }

  static async merchantCreateWithEmailPwd(body: Omit<UserEmailPwd, "role">) {
    const merchant = await this.registerWithEmailPwd({
      ...body,
      role: ROLES.MERCHANT,
    });

    return filterUserInfo(merchant, ["createdBy"]);
  }

  static async createAdmin(body: AdminCreateBody) {
    try {
      const admin = await UserRepo.createAdmin(body);

      return filterUserInfo(admin, [
        "isEnabled",
        "isVerified",
        "ssoProvider",
        "ssoProviderUserId",
      ]);
    } catch (error: any) {
      return genericAppError({
        error,
        defaultMsg: error?.message || "Unable to create admin",
      });
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const user = await UserRepo.findByEmail(email);

      if (user.id) {
        const removed = [];

        if (isCustomer(user.role) || isMerchant(user.role)) {
          removed.push("createdBy");
        }

        return filterUserInfo(user, ["createdBy"]);
      }

      throw new AppError({
        body: {
          error: `No user with email="${email}" exists`,
        },
        message: "Unable to find user",
        statusCode: 404,
      });
    } catch (error: any) {
      throw new AppError({
        body: error?.body ?? error,
        message: error?.message ?? "Error finding user by email",
        statusCode: error?.statusCode ?? 500,
      });
    }
  }

  static async getUserById(id: string) {
    try {
      const user = await UserRepo.findById(id);

      if (user.id) {
        const removed: UserKeysNoPwd[] = [];

        if (isCustomer(user.role) || isMerchant(user.role)) {
          removed.push("createdBy");
        }

        return filterUserInfo(user, removed);
      }

      throw new AppError({
        body: {
          error: `No user with id="${id}" exists`,
        },
        message: "Unable to find user",
        statusCode: 404,
      });
    } catch (error: any) {
      throw new AppError({
        body: error?.body ?? error,
        message: error?.message ?? "Error finding user by id",
        statusCode: error?.statusCode ?? 500,
      });
    }
  }

  static async getUserBySSOId(id: string | number, provider: SSO_PROVIDER) {
    try {
      const user = await UserRepo.findBySSOID(id, provider);

      if (user.id) {
        const removed = [];

        if (isCustomer(user.role) || isMerchant(user.role)) {
          removed.push("createdBy");
        }

        return filterUserInfo(user, ["createdBy"]);
      }

      throw new AppError({
        body: {
          error: `No user with ${provider} id="${id}" exists`,
        },
        message: "Unable to find user",
        statusCode: 404,
      });
    } catch (error: any) {
      throw new AppError({
        body: error?.body ?? error,
        message: error?.message ?? "Error finding user by sso id",
        statusCode: error?.statusCode ?? 500,
      });
    }
  }

  static async verifyUser(id: string) {
    try {
      const user = await UserRepo.update(id, ["is_verified"], [true]);

      return filterUserInfo(user);
    } catch (error: any) {
      throw new AppError({
        body: error?.body ?? error,
        message: error?.message ?? "Error verifying user",
        statusCode: error?.statusCode ?? 500,
      });
    }
  }

  static async getUsersByType(
    role: ROLES,
    lastValue?: string,
    limit = config.pageSize,
    order?: "ASC" | "DESC"
  ) {
    try {
      if (!isValidRole(role)) {
        throw new Error("Invalid user role");
      }

      const data = await UserRepo.list({
        lastValue,
        condition: `role = '${role}'`,
        pageSize: limit,
        order,
      });

      return {
        totalCount: data.totalCount,
        users: data.users.map((user) =>
          pickUserInfo(user, [
            "id",
            "email",
            "firstName",
            "lastName",
            "avatarUrl",
            "role",
            "createdAt",
          ])
        ),
      };
    } catch (error: any) {
      throw new AppError({
        body: error?.body ?? error,
        message: error?.message ?? `Error getting ${role.toLowerCase()}s`,
        statusCode: error?.statusCode ?? 500,
      });
    }
  }

  static async createUserByGithub({
    email,
    avatar_url,
    id,
    login,
    role,
  }: GithHubUser) {
    try {
      const newUser = await UserRepo.createWithGitHub({
        email,
        avatar_url,
        id,
        login,
        role,
      });

      return filterUserInfo(newUser, ["createdBy"]);
    } catch (error: any) {
      throw new AppError({
        body: error?.body ?? error,
        message: error?.message ?? "Error creating user with github",
        statusCode: error?.statusCode ?? 500,
      });
    }
  }

  static async updateUser(userId: string, body: UpdateUserBody) {
    return;
  }

  static async disableUser(userId: string) {
    return;
  }
}

export default UserService;
