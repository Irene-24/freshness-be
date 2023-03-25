import bcrypt from "bcrypt";
import UserRepo from "@/repo/User.repo";
import { ROLES } from "@/utils/commonType";
import { AppError } from "@/utils/APIError";
import { UserInfo } from "@/dto/User.dto";

const saltRounds = 10;

class AuthService {
  static async comparePwd(password: string, hashedPassword: string) {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch {
      return false;
    }
  }

  static async hashPwd(password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Unable to process password");
    }
  }

  static async loginWithPassword(email: string, password: string, role: ROLES) {
    try {
      const user = await UserRepo.findByEmail(email, ["password"]);

      if (user.role === role) {
        const isCorrectPwd = await this.comparePwd(password, user.password);

        return { isCorrectPwd, user: user as UserInfo };
      }

      throw new Error(`Invalid role`);
    } catch (error: any) {
      throw new AppError({
        body: error.body ?? error,
        message:
          error.message ?? "Error logging user in with this email/password",
        statusCode: error?.statusCode ?? 400,
      });
    }
  }
}

export default AuthService;
