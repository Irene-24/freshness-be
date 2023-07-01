import { AppError } from "@/utils/APIError";
import { ROLES } from "@/utils/commonType";
import axios from "axios";
import config from "@/src/config";
import { GithHubUser } from "@/dto/User.dto";

const { githubConfig } = config;

interface GHEmail {
  email: string;
}

class GithubService {
  static async getUserEmail(access_token: string) {
    const url = "https://api.github.com/user/emails";

    try {
      const { data } = await axios({
        url,
        method: "get",
        headers: {
          Authorization: `token ${access_token}`,
        },
      });

      if ((data as GHEmail[]).length) {
        return data[0].email;
      }

      throw new Error("Unable to find Github user email");
    } catch (error: any) {
      throw new AppError({
        message: error?.message ?? "Unable to find Github user email",
        statusCode: 404,
      });
    }
  }

  static async getUserInfo(access_token: string) {
    try {
      const { data } = await axios({
        url: "https://api.github.com/user",
        method: "get",
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
      return data as Omit<GithHubUser, "role">;
    } catch (error: any) {
      throw new AppError({
        message: error?.message ?? "Unable to get Github user data",
        statusCode: 400,
      });
    }
  }

  static async getGitHubToken(code: string) {
    try {
      const result = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: githubConfig.clientId,
          client_secret: githubConfig.clientSecret,
          code: code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const token = result.data.access_token;

      if (token) {
        return token;
      }

      throw new AppError({
        message: "Unable to get verify with Github",
        statusCode: 400,
      });
    } catch (error: any) {
      throw new AppError({
        message: error?.message ?? "Unable to get verify with Github",
        statusCode: 400,
      });
    }
  }

  static async startAuth(role: Exclude<ROLES, ROLES.ADMIN>, siteUrl: string) {
    let state = JSON.stringify({ siteUrl, role });
    const buff = Buffer.from(state, "utf-8");
    state = buff.toString("base64");

    const url = `https://github.com/login/oauth/authorize?client_id=${githubConfig.clientId}&scope=read%3Auser+user%3Aemail&state=${state}`;
    return url;
  }
}

export default GithubService;
