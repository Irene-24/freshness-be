import { NextFunction, Request, Response } from "express";

import TokenService from "@/services/Token.service";
import AuthService from "@/services/Auth.service";

class AuthController {
  static async loginCustomerWithPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await AuthService.customerPasswordLogin(
        req.body.email,
        req.body.password
      );

      if (result?.isCorrectPwd) {
        const jwt = await TokenService.generateJWT(result.user.id);
        const refreshToken = await TokenService.generateRefreshToken(
          result.user.id
        );

        return res.json({ jwt, refreshToken });
      }

      return res
        .status(400)
        .json({ error: { message: "Invalid password/email" } });
    } catch (error: any) {
      return next(error);
    }
  }

  //initaiteresetcustomerpwd

  //completeresetcustomerpwd

  ////verify setup token
}

export default AuthController;
