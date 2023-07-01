import { toCamelCase } from "@/utils/casing";
import format from "pg-format";
import pool from "@/src/db";
import { AppError } from "@/utils/APIError";
interface UserToken {
  userId: string;
  refreshToken: string;
  verifyToken: string | null;
}

class TokenRepository {
  async query(sql: string) {
    return await pool.query(sql);
  }

  async addOrUpdateRefreshToken(id: string, token: string) {
    try {
      const result = await this.query(
        format(
          `UPDATE user_tokens
            SET refresh_token = %1$L
            WHERE user_id =  %2$L RETURNING *;
        `,
          token,
          id
        )
      );
      return toCamelCase<UserToken>(result?.rows[0]);
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: error.message || `Unable to generate token info`,
      });
    }
  }

  async addOrUpdateVerifyToken(id: string, token: string) {
    try {
      const result = await this.query(
        format(
          `UPDATE user_tokens
            SET verify_token = %1$L
            WHERE user_id = %2$L RETURNING *;
        `,
          token,
          id
        )
      );

      return toCamelCase<UserToken>(result?.rows[0]);
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: error.message || `Unable to update verifyToken info`,
      });
    }
  }

  async findByUserId(id: string) {
    try {
      const result = await this.query(
        format(
          `SELECT * FROM user_tokens           
            WHERE user_id = %L LIMIT 1;
        `,
          id
        )
      );

      return toCamelCase<UserToken>(result?.rows[0]);
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: error.message || `Unable to retrieve token info`,
      });
    }
  }
}

const TokenRepo = new TokenRepository();

export default TokenRepo;
