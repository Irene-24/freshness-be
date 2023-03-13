import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

//set node_env close to node index.js not in build step
//else it will make it dev
console.log({ env: process.env.NODE_ENV });

const path =
  process.env.NODE_ENV === "production"
    ? __dirname + `/../.env`
    : __dirname + `/../.env.${process.env.NODE_ENV}`;

const envFound = dotenv.config({
  path,
}); // change according to your need

if (envFound.error) {
  throw new Error("⚠️  Couldn't find any .env file  ⚠️");
}

export default {
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === "development",
  port: parseInt(process.env.PORT as string, 10),
  pageSize: parseInt(process.env.LIMIT as string, 10),
  dbConfig: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
  },
  jwtConfig: {},
  emailConfig: {},
};
