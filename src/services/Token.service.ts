import { sign, verify, JwtPayload } from "jsonwebtoken";
import CryptoJS from "crypto-js";
import config from "@/src/config";
import { AppError } from "@/utils/APIError";

const { jwtConfig } = config;

const encode = (value: string) => {
  if (!jwtConfig.refreshSecret) {
    throw new Error("Missing 'SALT'");
  }

  if (!value) {
    throw new Error("Missing value");
  }

  return CryptoJS.AES.encrypt(value, jwtConfig.refreshSecret).toString();
};

const decode = (value: string) => {
  if (!jwtConfig.refreshSecret) {
    throw new Error("Missing 'SALT'");
  }

  if (!value) {
    throw new Error("Missing value");
  }

  const bytes = CryptoJS.AES.decrypt(value, jwtConfig.refreshSecret);
  return bytes.toString(CryptoJS.enc.Utf8);
};

interface UserIDJwtPayload extends JwtPayload {
  id: string;
}

const week = 7 * 24 * 60 * 60 * 1000;

class TokenService {
  static async generateJWT(id: string) {
    try {
      const jwt = sign({ id }, jwtConfig.jwtSecret as string, {
        expiresIn: "10m",
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
      });
    }
  }

  static async generateRefreshToken(id: string) {
    const refreshToken = encode(JSON.stringify({ id, duration: week }));

    //save token to db

    return refreshToken;
  }

  static async verifyRefreshToken(refreshToken: string) {
    //get user id and token duration
    //verify userid via usertoken db and duration is still valid

    //if fail throw error

    //return true
    return;
  }
}

export default TokenService;
