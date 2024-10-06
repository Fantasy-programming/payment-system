import { Elysia, t } from "elysia"
import { swagger } from "@elysiajs/swagger"
import { autoload } from "elysia-autoload"
import pkg from "../package.json"

import { loggerPlugin, redisPlugin } from "./middleware/logger"

export const createApp = async () => {
  const app = new Elysia()
    .use(loggerPlugin)
    .use(redisPlugin)
    .ws("/api/v2/live", {
      type: "json",
      body: t.Object({
        type: t.Union([t.Literal("health"), t.Literal("user"), t.Literal("logs")]),
        device: t.String(),
      }),
      message: (ws, msg) => {
        // step1: the user ask for some DataStream
        // step2: we verify that the user has right to the device
        // step3: if the task is health then we return the latest health data from cache

        if (msg.type == "health") {
          // we return the latest health data from cache
          ws.data.cache.redis.get(`$type:health$sn:${msg.device}`).then((cache) => {
            if (cache) {
              ws.send(cache)
            } else {
              ws.send(JSON.stringify({ error: "No data found" }))
            }
          })
        }

        // step4: if the task is a custom one then we genrate an action file to be served and we monitor (each 5s) if a result is in the cache
        // if the result is in the cache we send it to the user, else we send a pending status, if the user close the connection or there is nothing after 10s we send an error then stop
      },
      close: (ws) => {},
    })
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
