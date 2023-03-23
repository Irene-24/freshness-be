import { UserEmailPwd } from "@/dto/User.dto";
import UserRepo from "@/repo/User.repo";
import { UserWithEmailPwdSchema } from "@/validators/schemas/User.schema";
import { ROLES } from "@/utils/commonType";
import bcrypt from "bcrypt";
import { AppError } from "@/utils/APIError";
import { genericAppError } from "@/utils/errorHandler";

const saltRounds = 10;

class UserService {
  private static async registerWithEmailPwd(body: UserEmailPwd) {
    try {
      await UserWithEmailPwdSchema.parseAsync(body);

      const hashPwd = await this.hashPwd(body.password);
      const newUser = await UserRepo.create({ ...body, password: hashPwd });

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

  static async hashPwd(password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Unable to process password");
    }
  }

  static async comparePwd(password: string, hashedPassword: string) {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      return false;
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const user = await UserRepo.findByEmail(email);

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
