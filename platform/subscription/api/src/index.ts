import http from "node:http"
import env from "./env"
import { createApp } from "./app"

import { Logger } from "@mikcloud/logger"
import { Db } from "./adapters/mongo.adapter"
import { Scheduler } from "./adapters/pulse.adapter"
import { Cache } from "./adapters/redis.adapter"
import { Metrics } from "./adapters/prometheus.adapter"

let isShuttingDown = false

const Log = new Logger({ lokiUri: env.LOKI_URI })
const log = Log.logger

async function startServer() {
  // Dependencies
  const db = new Db(Log)
  const scheduler = new Scheduler(db, Log)
  const cache = new Cache(env.REDIS_URI, Log)
  const metrics = new Metrics()

  try {
    const app = await createApp({ db, scheduler, cache, metrics, log: Log })
    const server = http.createServer(app)

    server.listen(env.PORT)
    server.on("error", onError)
    server.on("listening", onListening)
    server.on("close", onClose)

    function onListening() {
      const addr = server.address()
      const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`
      log.info(`🚀 Process ${process.pid} listening on ${bind}`)
    }

    function onError(error: NodeJS.ErrnoException) {
      if (error.syscall !== "listen") throw error
      const bind = `Port ${env.PORT}`
      switch (error.code) {
        case "EACCES":
          log.error(`${bind} requires elevated privileges`)
          process.exit(1)
          break
        case "EADDRINUSE":
          log.error(`${bind} is already in use`)
          process.exit(1)
          break
        default:
          throw error
      }
    }

    function onClose() {
      db.close()
      scheduler.pulse.stop()
      log.info("🔌 Closing server connections")
    }

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      log.info("SIGTERM signal received: closing HTTP server")
      isShuttingDown = true
      server.close(() => {
        log.info("HTTP server closed")
        process.exit(0)
      })
    })
  } catch (error) {
    log.error("Failed to start server", error)
    process.exit(1)
  }
}

startServer().catch((error) => {
  log.error("Unhandled error during server startup", error)
  process.exit(1)
})
