import { toCamelCase } from "@/utils/casing";
import format from "pg-format";
import pool from "@/src/db";
import { genericAppError } from "@/utils/errorHandler";

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
            SET refreshToken = $1
            WHERE user_id = $2 RETURNING *;
        `,
          [token, id]
        )
      );

      return toCamelCase<UserToken>(result?.rows[0]);
    } catch (error: any) {
      return genericAppError({
        error,
        defaultMsg: error.message || `Unable to update refreshToken info`,
      });
    }
  }

  async addOrUpdateVerifyToken(id: string, token: string) {
    try {
      const result = await this.query(
        format(
          `UPDATE user_tokens
            SET verifyToken = $1
            WHERE user_id = $2 RETURNING *;
        `,
          [token, id]
        )
      );

      return toCamelCase<UserToken>(result?.rows[0]);
    } catch (error: any) {
      return genericAppError({
        error,
        defaultMsg: error.message || `Unable to update verifyToken info`,
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
      return genericAppError({
        error,
        defaultMsg: error.message || `Unable to retrieve token info`,
      });
    }
  }
}

const TokenRepo = new TokenRepository();

export default TokenRepo;
