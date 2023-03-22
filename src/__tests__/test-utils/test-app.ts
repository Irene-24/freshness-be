import createApp from "@/src/app";
import express, { NextFunction, Request, Response, Router } from "express";

type AppRoute = (app: Router) => void;

interface Args {
  routers: AppRoute | AppRoute[];
  routePrefix?: string;
}

const routes = (routers: AppRoute[] = []) => {
  const app = Router();

  routers.forEach((route) => route(app));

  return app;
};

const buildApp = ({ routers = [], routePrefix = "/api/v1" }: Args) => {
  const routersArray = Array.isArray(routers) ? routers : [routers];

  if (routersArray.length < 1) {
    throw new Error("Please pass in at least one router");
  }

  const expressApp = createApp();

  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  //route prefix is just so that it looks just like the actual api route
  expressApp.use(routePrefix, routes(routersArray));

  //catch all errors just in case
  expressApp.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error: any, req: Request, res: Response, next: NextFunction) => {
      res.status(error?.statusCode || 500).json({
        error,
      });
    }
  );

  return expressApp;
};

export default buildApp;
