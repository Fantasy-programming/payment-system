import Elysia from "elysia"
import { createPinoLogger, formatters, serializers } from "@bogeychan/elysia-logger"
import { Logger } from "@mikcloud/logger"
import { Redis } from "ioredis"
import env from "../env"

const Log = new Logger({ lokiUri: env.LOKI_URI, formatters, serializers })
export const log = createPinoLogger({}, Log.logger)

class Cache {
  public redis: Redis

  constructor(redisUri: string) {
    this.redis = new Redis(redisUri)

    console.log(redisUri)

    this.redis.on("error", (err) => {
      log.error(`🔴 Redis failed to connect: ${err}`)
    })

    this.redis.on("connect", () => {
      log.info("🟢 Redis connected")
    })
  }
}

export const loggerPlugin = new Elysia({ name: "logger" }).use(
  log.into({ autoLogging: env.NODE_ENV === "development" }),
)

export const redisPlugin = new Elysia({ name: "redis" }).decorate("cache", new Cache(env.REDIS_URI))
