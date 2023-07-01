import GithubService from "@/services/GitHub.service";
import TokenService from "@/services/Token.service";
import UserService from "@/services/User.service";
import { GitHubState, ROLES, SSO_PROVIDER } from "@/utils/commonType";
import Cookies from "cookies";
import { Request, Response } from "express";
import config from "@/src//config";

const handleCookieRes = async (id: string, req: Request, res: Response) => {
  const jwt = await TokenService.generateJWT(id);
  const refreshToken = await TokenService.generateRefreshToken(id);

  const cookies = new Cookies(req, res, {
    secure: config.isProd,
  });

  cookies.set("refreshToken", TokenService.encode(refreshToken), {
    httpOnly: true,
    maxAge: TokenService.getDur(),
    path: "/",
    sameSite: "lax",
  });

  return res.json({ jwt, id });
};

class GitHubController {
  static async initiateAuth(req: Request, res: Response) {
    try {
      //get site, customer/merchant
      //encode it and the callback url of site

      //convert to moddleware?
      const allowed = [ROLES.MERCHANT, ROLES.CUSTOMER];

      const role = req.query.role;
      const siteUrl = req.query.siteUrl as string;

      if (
        !siteUrl ||
        typeof siteUrl !== "string" ||
        typeof role !== "string" ||
        !allowed.includes(role as ROLES)
      ) {
        return res
          .status(400)
          .json({ message: "Missing/Invalid role/siteUrl" });
      }

      const url = await GithubService.startAuth(
        role as ROLES.CUSTOMER | ROLES.CUSTOMER,
        siteUrl
      );

      res.redirect(url);
    } catch (error: any) {
      return res.status(400).json({
        message: error?.message ?? "Error authorizing with github",
        error,
      });
    }
  }

  static async authoriseUser(req: Request, res: Response) {
    try {
      const code = req.query.code as string;

      if (!code) {
        return res.status(500).json({
          message: "Error authorizing with github",
        });
      }

      const token = await GithubService.getGitHubToken(code);
      const user = await GithubService.getUserInfo(token);
      const email = user.email ?? (await GithubService.getUserEmail(token));
      const buff = Buffer.from(req.query.state as unknown as string, "base64");
      const text = buff.toString("ascii");
      const state = JSON.parse(text) as GitHubState;

      user.email = email;
      const role = state.role;
      let newUser: any;

      try {
        const existingUser = await UserService.getUserBySSOId(
          user.id,
          SSO_PROVIDER.GITHUB
        );
        newUser = existingUser;

        if (existingUser.role === role) {
          return handleCookieRes(existingUser.id, req, res);
        }
      } catch (error: any) {
        throw new Error(
          error?.message || "Unable to complete authorization with github"
        );
      }

      //no existing user
      if (!newUser?.id) {
        if (role === ROLES.CUSTOMER) {
          newUser = await UserService.createUserByGithub({
            ...user,
            role: ROLES.CUSTOMER,
          });
        }

        if (role === ROLES.MERCHANT) {
          newUser = await UserService.createUserByGithub({
            ...user,
            role: ROLES.MERCHANT,
          });
        }

        return handleCookieRes(newUser.id, req, res);
      } else {
        //user exists but role is not correct
        throw new Error("Invalid user access data");
      }
    } catch (error: any) {
      return res.status(500).json({
        error: {
          message:
            error?.message || "Unable to complete authorization with github",
          body: error?.body,
        },
      });
    }
  }
}
export default GitHubController;
