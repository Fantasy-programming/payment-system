import { createApp } from "./app";
import { DB } from "./adapters/mongo";
import { Scheduler } from "./adapters/pulse";
import { PORT } from "./env";
import http from "node:http";
import logger from "./logger";

async function startServer() {
  const db = new DB();
  const scheduler = new Scheduler(db);

  try {
    const app = await createApp({ db, scheduler });
    const server = http.createServer(app);

    server.listen(PORT);
    server.on("error", onError);
    server.on("listening", onListening);
    server.on("close", onClosing);

    function onListening() {
      const addr = server.address();
      const bind =
        typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
      logger.info(`🚀 Server listening on ${bind}`);
    }

    function onError(error: NodeJS.ErrnoException) {
      if (error.syscall !== "listen") throw error;
      const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;
      switch (error.code) {
        case "EACCES":
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case "EADDRINUSE":
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    function onClosing() {
      db.close();
      scheduler.pulse.stop();
      logger.info("🔌 Closing server connections");
    }

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        logger.info("HTTP server closed");
      });
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  logger.error("Unhandled error during server startup", error);
  process.exit(1);
});
