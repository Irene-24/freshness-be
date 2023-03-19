import { UserEmailPwd } from "@/dto/User.dto";
import UserRepo from "@/repo/User.repo";
import { UserWithEmailPwdSchema } from "@/validators/schemas/User.schema";
import { ROLES } from "@/utils/commonType";
import bcrypt from "bcrypt";
import { AppError } from "@/utils/APIError";

const saltRounds = 10;

class UserService {
  static async registerWithEmailPwd(body: UserEmailPwd) {
    try {
      await UserWithEmailPwdSchema.parseAsync(body);

      const hashPwd = this.hashPwd(body.password);
      const newUser = await UserRepo.create({ ...body, password: hashPwd });

      return newUser;
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: "Unable to create user with password and email",
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

  static hashPwd(password: string) {
    let hashedPwd = "";
    bcrypt.genSalt(saltRounds, function (err: any, salt: string) {
      if (err) {
        throw new Error("Unable to process password");
      } else {
        bcrypt.hash(password, salt, function (err: any, hash: string) {
          if (err) {
            throw new Error("Unable to process password");
          } else {
            hashedPwd = hash;
          }
        });
      }
    });
    return hashedPwd;
  }
}

export default UserService;
