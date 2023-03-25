import { UserEmailPwd } from "@/dto/User.dto";
import UserRepo from "@/repo/User.repo";
import { UserWithEmailPwdSchema } from "@/validators/schemas/User.schema";
import { ROLES } from "@/utils/commonType";
import { AppError } from "@/utils/APIError";
import { genericAppError } from "@/utils/errorHandler";
import { hashPwd } from "@/utils/password";

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
          error.message || "Unable to create user with password and email",
      });
    }
  }

  static async customerCreateWithEmailPwd(body: Omit<UserEmailPwd, "role">) {
    return await this.registerWithEmailPwd({ ...body, role: ROLES.CUSTOMER });
  }

  static async merchantCreateWithEmailPwd(body: Omit<UserEmailPwd, "role">) {
    return await this.registerWithEmailPwd({ ...body, role: ROLES.MERCHANT });
  }

  static async createAdmin() {
    return 6;
  }

  static async getUserByEmail(email: string, extraFields?: string[]) {
    try {
      const user = await UserRepo.findByEmail(email, extraFields);

      if (user.id) {
        return user;
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
        body: error.body ?? error,
        message: error.message ?? "Error finding user by email",
        statusCode: error?.statusCode ?? 500,
      });
    }
  }
}

export default UserService;
