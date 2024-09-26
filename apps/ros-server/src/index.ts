import http from "node:http"
import env from "./env"
import { createApp } from "./app"
import { Log } from "./utils/logger"

async function startServer() {
  try {
    const app = await createApp({})
    const server = http.createServer(app)

    server.listen(env.PORT)
    server.on("error", onError)
    server.on("listening", onListening)
    server.on("close", onClose)

    function onListening() {
      const addr = server.address()
      const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`
      Log.logger.info(`🚀 Process ${process.pid} listening on ${bind}`)
    }

    function onError(error: NodeJS.ErrnoException) {
      if (error.syscall !== "listen") throw error
      const bind = `Port ${env.PORT}`
      switch (error.code) {
        case "EACCES":
          Log.logger.error(`${bind} requires elevated privileges`)
          process.exit(1)
        case "EADDRINUSE":
          Log.logger.error(`${bind} is already in use`)
          process.exit(1)
        default:
          throw error
      }
    }

    function onClose() {
      Log.logger.info("🔌 Closing server connections")
    }

    // Handle graceful shutdown
    process.on("SIGTERM", () => {
      Log.logger.info("SIGTERM signal received: closing HTTP server")
      server.close(() => {
        Log.logger.info("HTTP server closed")
        process.exit(0)
      })
    })
  } catch (error) {
    Log.logger.error("Failed to start server", error)
    process.exit(1)
  }
}

startServer().catch((error) => {
  Log.logger.error("Unhandled error during server startup", error)
  process.exit(1)
})
