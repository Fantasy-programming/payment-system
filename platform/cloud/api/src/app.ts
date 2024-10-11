import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { autoload } from "elysia-autoload"
import pkg from "../package.json"

import { loggerPlugin, redisPlugin } from "./middleware/logger"
import { ws } from "./middleware/websocket"

export const createApp = async () => {
  const app = new Elysia()
    .use(loggerPlugin)
    .use(redisPlugin)
    .use(ws)
    .use(await autoload({ prefix: "/api" }))
    .use(
      swagger({
        documentation: {
          info: {
            title: "ROS Server Documentation",
            version: pkg.version,
          },
        },
      }),
    )

  return app
}

export type AppType = Awaited<ReturnType<typeof createApp>>
