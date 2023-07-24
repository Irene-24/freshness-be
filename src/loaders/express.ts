import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { serializeError } from "serialize-error";
import config from "@/src/config";
import { ApiError, NotFoundError } from "@/src/utils/APIError";
import { omit } from "@/src/utils/miscHelpers";
import routes from "@/routes";

const people = [
  {
    id: 1,
    name: "Reinhard",
    email: "omo@slideshare.net",
  },
  {
    id: 24,
    name: "Lucio",
    email: "irene@is.gd",
  },
  {
    id: 3,
    name: "Gwyn",
    email: "gramalhete20@symantec.com",
  },
  {
    id: 4,
    name: "Caro",
    email: "csepey3@biglobe.ne.jp",
  },
  {
    id: 5,
    name: "Dodie",
    email: "dkoppke4@odnoklassniki.ru",
  },
];

export default ({ app }: { app: express.Application }) => {
  //TO DO enable logging (morgan?)

  app.get("/omo", async (req, res) => {
    res.json(people);
  });

  app.get(["/", "/test", "/status"], async (req, res) => {
    res.json({ message: `Server [${config.env}] is online!` });
  });

  app.enable("trust proxy");

  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1", routes());
  //add error routes

  app.use((req: Request, res: Response, next: NextFunction) =>
    next(new NotFoundError(req.path))
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const error = omit(
      serializeError(err),
      err.omitStack ? ["stack", "omitStack"] : "omitStack"
    );

    res.status(err?.statusCode || 500).json({
      error,
    });
  });
};
