import loaders from "@/loaders";
import createApp from "./app";
import config from "./config";

const app = createApp();

loaders({ expressApp: app });

app
  .listen(config.port, () => {
    console.info(`
      #######################################################################
          🛡️  Server is available at: http://localhost:${config.port} 🛡️
      #######################################################################
    `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });

// process.on("unhandledRejection", (reason: Error) => {
//   console.error(reason.name, reason.message);
//   console.error("UNHANDLED REJECTION! 💥 Shutting down...");
//   process.exit(1);
// });

// process.on("uncaughtException", (err: Error) => {
//   console.error(err.name, err.message);
//   console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");

//   process.exit(1);
// });
