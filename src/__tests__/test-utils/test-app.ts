import createApp from "@/src/app";
import { Router } from "express";

type AppRoute = (app: Router) => void;

interface Args {
  routers: AppRoute | AppRoute[];
  routePrefix?: string;
}

const buildApp = ({ routers = [], routePrefix = "/api/v1" }: Args) => {
  const routersArray = Array.isArray(routers) ? routers : [routers];

  if (routersArray.length < 1) {
    throw new Error("Please pass in at least one router");
  }

  const expressApp = createApp();
  const appRouter = Router();

  routersArray.forEach((router) => {
    router(appRouter);
  });

  expressApp.use(routePrefix, appRouter);

  return expressApp;
};

export default buildApp;
