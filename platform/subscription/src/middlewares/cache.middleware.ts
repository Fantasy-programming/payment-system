import logger from "../logger"
import type { Request, Response, NextFunction } from "express"
import { Redis } from "ioredis"
import type { ObjectId } from "mongoose"

export const checkCache = async (req: Request, res: Response, next: NextFunction) => {
  const redis = req.app.locals.cache
  const role = req?.user?.role || "user"
  const userID = req?.user?._id || "anonymous"

  const key = getCacheKey(req, role, userID)
  const tag = extractApiSegment(req.originalUrl)

  const hit = await redis.get(key)

  if (hit) {
    return res.send(JSON.parse(hit))
  }

  // Override res.send to cache the response
  const originalSend = res.send.bind(res)
  res.send = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      redis.set(key, JSON.stringify(body))
      redis.sadd(`tag:${tag}`, key)
    }

    return originalSend.call(res, body)
  }

  return next()
}

function getCacheKey(req: Request, userRole: string, userId: string | ObjectId): string {
  const { originalUrl } = req
  if (isUserSpecificRoute(originalUrl)) {
    return `cache:user:${userId}:${originalUrl}`
  }
  return `cache:role:${userRole}:${originalUrl}`
}

function isUserSpecificRoute(url: string): boolean {
  return url.includes("/api/transactions") || url.includes("/api/preferences") || url.includes("/api/users")
}

export const invalidateCache = async (redis: Redis, tag: string, userId?: string | ObjectId) => {
  const keys = await redis.smembers(`tag:${tag}`)
  const keysToDelete = userId ? keys.filter((key) => key.includes(`:${userId}:`)) : keys

  logger.info(`Invalidating cache for tag ${tag}, userId ${userId || "all"}. Keys: ${keysToDelete.join(", ")}`)

  if (keysToDelete.length > 0) {
    await redis.del(...keysToDelete)
    if (!userId) {
      await redis.del(`tag:${tag}`)
    } else {
      // Remove the deleted keys from the tag set
      await redis.srem(`tag:${tag}`, ...keysToDelete)
    }
  }
}

export function extractApiSegment(url: string) {
  const match = url.match(/\/api\/([^/?]+)/)
  return match ? match[1] : ""
}
