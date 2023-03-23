import BaseRespoitory from "@/repo/Base.repo";
import { AdminInfo, GithHubUser, UserEmailPwd, UserInfo } from "@/dto/User.dto";
import format from "pg-format";
import { toCamelCase, toCamelCaseRows } from "@/utils/casing";
import { pick } from "@/utils/miscHelpers";
import { AppError } from "@/utils/APIError";
import { genericAppError } from "@/utils/errorHandler";

type Key = keyof UserInfo;

type AKey = keyof AdminInfo;

const defaultKeys: Key[] = [
  "id",
  "email",
  "firstName",
  "lastName",
  "avatarUrl",
  "userName",
  "role",
];

const adminKeys: AKey[] = [...defaultKeys, "createdBy"];

class UserRepository extends BaseRespoitory {
  async create({ email, password, role }: UserEmailPwd) {
    try {
      const result = await this.query(
        format(
          "INSERT INTO users (email, password, role) VALUES %L RETURNING *;",
          [[email, password, role]]
        )
      );

      const newUser = pick(
        toCamelCase<UserInfo>(result?.rows[0] ?? {}),
        defaultKeys
      );

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
          "INSERT INTO users (email, avatar_url, id, user_name, role) VALUES %L RETURNING *;",
          [[email, avatar_url, id, login, role]]
        )
      );

      const newUser = pick(
        toCamelCase<UserInfo>(result?.rows[0] ?? {}),
        defaultKeys
      );

      return newUser;
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: `Unable to create new ${role || "user"} using github`,
      });
    }
  }

  update(body: any) {
    return 5;
  }

  updatePassword(body: any) {
    return 5;
  }

  delete(id: string) {
    return 5;
  }

  find() {
    return 5;
  }

  findById(id: string) {
    return 5;
  }

  async findByEmail(email: string) {
    try {
      const result = await this.query(
        format("SELECT * FROM users WHERE email=%L LIMIT 1;", [email])
      );

      const user = pick(
        toCamelCase<UserInfo>(result?.rows[0] ?? {}),
        defaultKeys
      );

      return user;
    } catch (error: any) {
      throw new AppError({
        body: error,
        message: `Unable find user with email ${email}`,
      });
    }
  }
}

const userRepo = new UserRepository();

export default userRepo;
