import { Application } from "express";
import config from "@/src/config";
import pool from "@/src/db";
import expressLoader from "./express";

const { dbConfig } = config;

export default async ({ expressApp }: { expressApp: Application }) => {
  //connect db

  pool
    .connect(dbConfig)
    .then(() => {
      console.info("✌️ DB loaded");
      //connect to express
      expressLoader({ app: expressApp });
      console.info("✌️ Express loaded");
    })
    .catch((err) => console.error(err));
};
