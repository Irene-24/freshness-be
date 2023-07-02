import BaseRespoitory from "@/repo/Base.repo";
import {
  AdminCreateBody,
  AdminInfo,
  GithHubUser,
  UserEmailPwd,
  UserInfo,
} from "@/dto/User.dto";
import format from "pg-format";
import { toCamelCase, toCamelCaseRows } from "@/utils/casing";
import { AppError } from "@/utils/APIError";
import { genericAppError } from "@/utils/errorHandler";
import { Pagination, SSO_PROVIDER, ROLES } from "@/utils/commonType";
import config from "@/src/config";

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

  async createAdmin({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    userName = null,
    createdBy = null,
  }: AdminCreateBody) {
    try {
      const result = await this.query(
        format(
          "INSERT INTO users (email, password , first_name, last_name, phone_number, user_name, created_by, role, is_enabled, is_verified) VALUES %L RETURNING *;",
          [
            [
              email,
              password,
              firstName,
              lastName,
              phoneNumber,
              userName,
              createdBy,
              ROLES.ADMIN,
              true,
              true,
            ],
          ]
        )
      );

      const admin = toCamelCase<AdminInfo>(result?.rows[0] ?? {});

      return admin;
    } catch (error: any) {
      return genericAppError({
        error,
        defaultMsg: error.message || `Unable to create new admin`,
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

  async list({
    lastValue,
    condition,
    order = "ASC",
    pageSize = config.pageSize,
  }: Pagination) {
    try {
      let query = format(`SELECT * FROM users`);

      if (condition) {
        query += format(` WHERE %s`, condition);
      }

      if (lastValue) {
        query += format(
          ` AND id ${order === "DESC" ? "<" : ">"}  %L`,
          lastValue
        );
      }

      query += format(
        ` ORDER BY created_at ${order}
      LIMIT %L`,
        pageSize
      );

      const result = await this.query(format(query));

      const countQuery = `SELECT COUNT(*) FROM users${
        condition ? ` WHERE ${condition}` : ""
      };`;
      const countResult = await this.query(countQuery);
      const totalCount = Number(countResult?.rows[0]?.count);

      if (result?.rows) {
        const users = toCamelCaseRows<UserInfo>(result.rows);

        return { users, totalCount };
      }

      return { users: [], totalCount };
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: "Unable to retrieve users",
      });
    }
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
