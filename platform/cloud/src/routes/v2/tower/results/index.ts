import type { AppType } from "@/app"
import { t } from "elysia"

//QUESTION: What the hell are we going to do with this ?? (capture interfaces)
//MAYBE: If we don't receive a positive health check every 5 minutes (we clean the cache and consider the device as down)
//HMM: We need a snapshot of the last interface (before the device went down)

export default (app: AppType) =>
  app.post(
    "/",
    async ({ body, cache, query }) => {
      console.log(query)

      //return the results

      cache.redis.set(`results:${query.sn}`, JSON.stringify(body))
      return { success: true }
    },
    { type: "json", query: t.Object({ sn: t.String() }) },
  )
