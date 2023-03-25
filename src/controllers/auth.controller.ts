import { Request, Response } from "express";
import TokenService from "@/services/Token.service";
import { ROLES } from "@/utils/commonType";
import AuthService from "@/services/Auth.service";
import { genericAppError } from "@/utils/errorHandler";

class AuthController {
  static async loginCustomerWithPassword(req: Request, res: Response) {
    try {
      const result = await AuthService.loginWithPassword(
        req.body.email,
        req.body.password,
        ROLES.CUSTOMER
      );

      if (result?.isCorrectPwd) {
        const jwt = await TokenService.generateJWT(result.user.id);
        // const refreshToken = await TokenService.generateRefreshToken(
        //   result.user.id
        // );

        res.json({ jwt, refreshToken: 5 });
      }

      return res.status(400).json({ message: "Invalid password/email" });
    } catch (error: any) {
      return genericAppError({ error });
    }
  }

  //initaiteresetcustomerpwd

  //completeresetcustomerpwd

  ////verify setup token
}

export default AuthController;
