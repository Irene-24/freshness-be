import { NextFunction, Request, Response } from "express";
import Cookies from "cookies";

import TokenService from "@/services/Token.service";
import AuthService from "@/services/Auth.service";
import config from "@/src/config";
import UserService from "@/services/User.service";

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

        const cookies = new Cookies(req, res, {
          secure: config.isProd,
        });

        cookies.set("refreshToken", TokenService.encode(refreshToken), {
          httpOnly: true,
          maxAge: TokenService.getDur(),
          path: "/",
          sameSite: "lax",
        });

        return res.json({ jwt, id: result.user.id });
      }

      return res
        .status(400)
        .json({ error: { message: "Invalid password/email" } });
    } catch (error: any) {
      return next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const validRefreshToken = await TokenService.verifyRefreshToken(
        decodeURIComponent(req.body.refreshToken)
      );

      if (validRefreshToken?.userId) {
        const jwt = await TokenService.generateJWT(validRefreshToken.userId);
        const refreshToken = await TokenService.generateRefreshToken(
          validRefreshToken.userId
        );

        const cookies = new Cookies(req, res, {
          secure: config.isProd,
        });

        cookies.set("refreshToken", TokenService.encode(refreshToken), {
          httpOnly: true,
          maxAge: TokenService.getDur(),
          path: "/",
          sameSite: "lax",
        });

        return res.json({
          jwt,
          id: validRefreshToken.userId,
        });
      }

      return res
        .status(400)
        .json({ error: { message: "Invalid password/email" } });
    } catch (error: any) {
      return next(error);
    }
  }

  //initaiteresepwd

  //completeresetcustomerpwd

  static async confirmEmailToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = await TokenService.verifyEmailToken(
        decodeURIComponent(req.body.token)
      );

      const user = await UserService.verifyUser(userId);

      return res
        .status(200)
        .json({ message: `User with email ${user.email} has been verified` });
    } catch (error: any) {
      return next(error);
    }
  }
}

export default AuthController;
