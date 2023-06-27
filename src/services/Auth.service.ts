import UserRepo from "@/repo/User.repo";
import { ROLES } from "@/utils/commonType";
import { AppError } from "@/utils/APIError";
import { comparePwd } from "@/utils/password";
import { filterUserInfo, isCustomer, isMerchant } from "@/utils/user";
import config from "@/src/config";

class AuthService {
  static async loginWithPassword(email: string, password: string, role: ROLES) {
    try {
      const user = await UserRepo.findByEmail(email);

      let filteredUser: Omit<typeof user, "password" | "createdBy"> = user;

      if (!user.isEnabled) {
        throw new AppError({
          body: {
            error: `No user with email="${email}" exists`,
          },
          message: "Unable to find user",
          statusCode: 404,
        });
      }

      if (!user.isVerified && !config.isDev) {
        throw new AppError({
          body: {
            error: `User with email="${email}" not verified`,
          },
          message: "This user has not verified their account",
          statusCode: 403,
        });
      }

      if (user.role === role) {
        const isCorrectPwd = await comparePwd(
          password,
          user.password as string
        );

        if (isCustomer(user.role) || isMerchant(user.role)) {
          filteredUser = filterUserInfo(user, ["createdBy"]);
        }
        return { isCorrectPwd, user: filteredUser };
      }

      throw new Error("Unable to find user");
    } catch (error: any) {
      throw new AppError({
        body: error.body ?? error,
        message:
          error.message ?? "Error logging user in with this email/password",
        statusCode: error?.statusCode ?? 400,
      });
    }
  }

  static async customerPasswordLogin(email: string, password: string) {
    return this.loginWithPassword(email, password, ROLES.CUSTOMER);
  }

  static async merchantPasswordLogin(email: string, password: string) {
    return this.loginWithPassword(email, password, ROLES.MERCHANT);
  }
}

export default AuthService;
