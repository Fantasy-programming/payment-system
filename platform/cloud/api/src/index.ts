import { createApp } from "./app"
import { log } from "./middleware/logger"

import env from "./env"

async function startServer() {
  const app = await createApp()

  app.onStart(({ server }) => {
    const addr = server?.url
    log.info(`🚀 Process ${process.pid} listening on port ${addr?.port}`)
  })

  app.listen(env.PORT)
}

startServer().catch((error) => {
  log.error(error)
  process.exit(1)
})
