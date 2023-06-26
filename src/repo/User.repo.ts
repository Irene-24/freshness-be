import BaseRespoitory from "@/repo/Base.repo";
import { GithHubUser, UserEmailPwd, UserInfo } from "@/dto/User.dto";
import format from "pg-format";
import { toCamelCase, toCamelCaseRows } from "@/utils/casing";
import { AppError } from "@/utils/APIError";
import { genericAppError } from "@/utils/errorHandler";
import { SSO_PROVIDER } from "@/utils/commonType";

class UserRepository extends BaseRespoitory {
  async create({ email, password, role }: UserEmailPwd) {
    try {
      const result = await this.query(
        format(
          "INSERT INTO users (email, password, role) VALUES %L RETURNING *;",
          [[email, password, role]]
        )
      );

      const newUser = toCamelCase<UserInfo>(result?.rows[0] ?? {});

      return newUser;
    } catch (error: any) {
      return genericAppError({
        error,
        defaultMsg: error.message || `Unable to create new ${role || "user"}`,
      });
    }
  }

  async createWithGitHub({ email, avatar_url, id, login, role }: GithHubUser) {
    try {
      const result = await this.query(
        format(
          "INSERT INTO users (email, avatar_url, sso_provider_user_id, user_name, role, sso_provider,is_verified) VALUES %L RETURNING *;",
          [[email, avatar_url, id, login, role, SSO_PROVIDER.GITHUB, true]]
        )
      );

      const newUser = toCamelCase<UserInfo>(result?.rows[0] ?? {});

      return newUser;
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: `Unable to create new ${role || "user"} using github`,
      });
    }
  }

  async update(
    id: string,
    columns: string[],
    values: (string | number | boolean)[]
  ) {
    try {
      const setClause = columns
        .map((column, index) => format("%I = %L", column, values[index]))
        .join(", ");

      const result = await this.query(
        format(
          `UPDATE %I
    SET %s
    WHERE id = %L
    RETURNING *;`,
          "users",
          setClause,
          id
        )
      );

      const user = toCamelCase<UserInfo>(result?.rows[0] ?? {});

      return user;
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: `Unable to update user`,
      });
    }
  }

  async updatePassword(body: any) {
    return 5;
  }

  async delete(id: string) {
    return 5;
  }

  async findById(id: string) {
    try {
      const result = await this.query(
        format("SELECT * FROM users WHERE  id=%L LIMIT 1;", [id])
      );

      const user = toCamelCase<UserInfo>(result?.rows[0] ?? {});

      return user;
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: `Unable find user with id ${id}`,
      });
    }
  }

  async findByEmail(email: string) {
    try {
      const result = await this.query(
        format("SELECT * FROM users WHERE email=%L LIMIT 1;", [email])
      );

      const user = toCamelCase<UserInfo>(result?.rows[0] ?? {});

      return user;
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: `Unable find user with email ${email}`,
      });
    }
  }

  async findBySSOID(id: string | number, provider: SSO_PROVIDER) {
    try {
      const result = await this.query(
        format(
          "SELECT * FROM users WHERE sso_provider=%1$L AND sso_provider_user_id=%2$L LIMIT 1;",

          provider,
          id
        )
      );

      const user = toCamelCase<UserInfo>(result?.rows[0] ?? {});

      return user;
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: `Unable find user with this github id`,
      });
    }
  }
}

const userRepo = new UserRepository();

export default userRepo;
