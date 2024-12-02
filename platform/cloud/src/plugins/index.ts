import { Elysia, type InferContext } from "elysia"
import { loggerPlugin, redisPlugin } from "./logger"
import { pubSubPlugin } from "./pubsub"

export const plugins = new Elysia({ name: "plugins" }).use(loggerPlugin).use(redisPlugin).use(pubSubPlugin)

export type PluginContext = InferContext<typeof plugins>
