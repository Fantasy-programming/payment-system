import { Redis } from "ioredis";
import logger from "../logger";

export class Cache {
  public redis: Redis;

  constructor(redisUri: string) {
    this.redis = new Redis(redisUri);

    this.redis.on("error", (err) => {
      logger.error(`🔴 Redis failed to connect: ${err}`);
    });

    this.redis.on("connect", () => {
      logger.info("🟢 Redis connected");
    });
  }
}
