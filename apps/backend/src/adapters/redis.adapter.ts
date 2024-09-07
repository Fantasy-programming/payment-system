import { Redis } from "ioredis"
import type { Logger } from "@mikronet/logger"

export class Cache {
  public redis: Redis

  constructor(redisUri: string, logger: Logger) {
    this.redis = new Redis(redisUri)
    const log = logger.logger

    this.redis.on("error", (err) => {
      log.error(`🔴 Redis failed to connect: ${err}`)
    })

    this.redis.on("connect", () => {
      log.info("🟢 Redis connected")
    })
  }
}
