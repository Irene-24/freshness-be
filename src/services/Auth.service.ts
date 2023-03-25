import UserRepo from "@/repo/User.repo";
import { ROLES } from "@/utils/commonType";
import { AppError } from "@/utils/APIError";
import { UserInfo } from "@/dto/User.dto";
import { comparePwd } from "@/utils/password";

class AuthService {
  static async loginWithPassword(email: string, password: string, role: ROLES) {
    try {
      const user = await UserRepo.findByEmail(email, ["password"]);

      if (user.role === role) {
        const isCorrectPwd = await comparePwd(password, user.password);

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
