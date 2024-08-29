import http from "node:http";
import cluster from "node:cluster";
import logger from "./logger";

import { createApp } from "./app";
import { Db } from "./adapters/mongo.adapter";
import { Scheduler } from "./adapters/pulse.adapter";
import { Cache } from "./adapters/redis.adapter";

import { PORT, REDIS_URI } from "./env";

const cpus = navigator.hardwareConcurrency;
let isShuttingDown = false;

async function startServer() {
  // Dependencies
  const db = new Db();
  const scheduler = new Scheduler(db);
  const cache = new Cache(REDIS_URI as string);

  try {
    const app = await createApp({ db, scheduler, cache });
    const server = http.createServer(app);

    server.listen(PORT);
    server.on("error", onError);
    server.on("listening", onListening);
    server.on("close", onClose);

    function onListening() {
      const addr = server.address();
      const bind =
        typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
      logger.info(`🚀 Worker process ${process.pid} listening on ${bind}`);
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

    function onClose() {
      db.close();
      scheduler.pulse.stop();
      logger.info("🔌 Closing server connections");
    }

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM signal received: closing HTTP server");
      isShuttingDown = true;
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

if (cluster.isPrimary) {
  logger.debug(`Primary worker ${process.pid} is running`);

  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    if (isShuttingDown) {
      logger.debug(`Worker ${worker.process.pid} exited during shutdown`);
    } else {
      logger.error(
        `Worker ${worker.process.pid} died with code ${code} or signal ${signal}. Restarting...`,
      );
      cluster.fork();
    }
  });

  process.on("SIGTERM", () => {
    logger.info("SIGTERM signal received: shutting down primary process");
    isShuttingDown = true;

    // Disconnect all workers and stop respawning
    cluster.disconnect(() => {
      logger.info("All workers disconnected, shutting down primary process");
      process.exit(0);
    });
  });
} else {
  startServer().catch((error) => {
    logger.error("Unhandled error during server startup", error);
    process.exit(1);
  });
}
