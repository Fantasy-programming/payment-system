import { Elysia } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { autoload } from "elysia-autoload"
import pkg from "../package.json"

import { plugins } from "./plugins"
import { ws } from "./service/websocket"

export const createApp = async () => {
  const app = new Elysia()
    .use(plugins)
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
