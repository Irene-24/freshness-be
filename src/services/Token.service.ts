import { sign, verify, JwtPayload } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import config from "@/src/config";
import { AppError } from "@/utils/APIError";
import TokenRepo from "@/repo/TokenRepo";

const { jwtConfig } = config;

interface UserIDJwtPayload extends JwtPayload {
  id: string;
}

interface RefreshPayload {
  id: string;
  createdAt: string;
  duration: number;
}

const week = 7 * 24 * 60 * 60 * 1000;
const twentyMins = 20 * 60 * 1000;

class TokenService {
  static async generateJWT(id: string) {
    try {
      const jwt = sign({ id }, jwtConfig.jwtSecret as string, {
        expiresIn: jwtConfig.duration || "10m",
      });

      return jwt;
    } catch (error) {
      throw new Error("Unable to generateJWT");
    }
  }

  static async validateJWT(jwt: string) {
    try {
      const decoded = <UserIDJwtPayload>(
        verify(jwt, jwtConfig.jwtSecret as string)
      );

      if (decoded?.id) {
        return decoded.id;
      } else {
        throw new Error("Unable to decode JWT");
      }
    } catch (error: any) {
      throw new AppError({
        message: error.message ?? "Unable to decode JWT",
        body: error,
        statusCode: 401,
      });
    }
  }

  static async generateRefreshToken(id: string) {
    try {
      const refreshToken = this.encode(
        JSON.stringify({
          id,
          duration: week,
          createdAt: new Date().toISOString(),
        })
      );

      await TokenRepo.addOrUpdateRefreshToken(id, refreshToken);

      return refreshToken;
    } catch (error: any) {
      throw new AppError({
        message: error?.message || "Could not generate refresh token",
        body: error?.body ?? error,
      });
    }
  }

  static async verifyRefreshToken(
    refreshToken: string,
    isEmailToken?: boolean
  ) {
    try {
      const tokenPayload: RefreshPayload = JSON.parse(
        this.decode(refreshToken)
      );

      if (!tokenPayload.id) {
        throw new Error(`Invalid ${isEmailToken ? "email" : "refresh"} token`);
      }

      const now = new Date().getMilliseconds();
      const diff = now - new Date(tokenPayload.createdAt).getMilliseconds();
      const dur = isEmailToken ? twentyMins : week;

      if (diff < dur) {
        const fullInfo = await TokenRepo.findByUserId(tokenPayload.id);

        if (fullInfo.refreshToken !== refreshToken) {
          throw new Error(
            `Invalid ${isEmailToken ? "email" : "refresh"} token`
          );
        }
        return fullInfo;
      } else {
        throw new Error(`Invalid ${isEmailToken ? "email" : "refresh"} token`);
      }
    } catch (error: any) {
      throw new AppError({
        message:
          error?.message ||
          `Invalid ${isEmailToken ? "email" : "refresh"} token`,
        body: error?.body ?? error,
        statusCode: 401,
      });
    }
  }

  static async generateEmailToken(userId: string) {
    try {
      const token = await this.encode(
        JSON.stringify({
          id: userId,
          duration: "20m",
          createdAt: new Date().toISOString(),
        })
      );

      await TokenRepo.addOrUpdateVerifyToken(userId, token);

      return token;
    } catch (error: any) {
      throw new AppError({
        message: error?.message || "Could not generate refresh token",
        body: error?.body ?? error,
      });
    }
  }

  static async verifyEmailToken(token: string) {
    try {
      const fullInfo = await TokenService.verifyRefreshToken(token, true);

      if (fullInfo.userId) {
        return true;
      }

      return false;
    } catch (error: any) {
      throw new AppError({
        message: error?.message || `Invalid email token`,
        body: error?.body ?? error,
        statusCode: 400,
      });
    }
  }

  static getDur() {
    return week;
  }

  static decode(value: string) {
    if (!jwtConfig.refreshSecret) {
      throw new Error("Missing 'SALT'");
    }

    if (!value) {
      throw new Error("Missing value");
    }

    const bytes = CryptoJS.AES.decrypt(value, jwtConfig.refreshSecret);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static encode(value: string) {
    if (!jwtConfig.refreshSecret) {
      throw new Error("Missing 'SALT'");
    }

    if (!value) {
      throw new Error("Missing value");
    }

    return CryptoJS.AES.encrypt(value, jwtConfig.refreshSecret).toString();
  }
}

export default TokenService;
