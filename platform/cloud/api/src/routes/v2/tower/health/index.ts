import type { AppType } from "@/app"
import { towerHealth } from "@/types/v2.type"

//QUESTION: What the hell are we going to do with this ?? (capture interfaces)
//MAYBE: If we don't receive a positive health check every 5 minutes (we clean the cache and consider the device as down)
//HMM: We need a snapshot of the last interface (before the device went down)

export default (app: AppType) =>
  app.post(
    "/",
    async ({ body, cache, sendWs }) => {
      const { network, sn } = body
      // Check if the token exists
      cache.redis.set(`$type:health$sn:${sn}`, JSON.stringify(network))
      sendWs(`$type:health$sn:${sn}`, { status: "success", data: network })
      return { success: true }
    },
    { body: towerHealth, type: "json" },
  )
