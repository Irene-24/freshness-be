import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

//set node_env close to node index.js not in build step
//else it will make it dev
//console.log({ env: process.env.NODE_ENV });

const getEnvPath = () => {
  let path = __dirname + `/../.env`;

  switch (process.env.NODE_ENV) {
    case "production":
      path += ``;

    case "test":
      path += `.test`;
      break;

    default:
      path += `.development`;
      break;
  }

  return path;
};

const path = getEnvPath();

const envFound = dotenv.config({
  path,
}); // change according to your need

if (envFound.error) {
  throw new Error("⚠️  Couldn't find any .env file  ⚠️");
}

export default {
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT as string, 10),
  pageSize: parseInt(process.env.LIMIT as string, 10),
  dbConfig: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  jwtConfig: {
    jwtSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.SECRET_KEY,
  },
  emailConfig: {},
};
