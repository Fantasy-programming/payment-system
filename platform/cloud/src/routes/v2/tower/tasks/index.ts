import type { AppType } from "@/app"
import { towerTasksQuery } from "@/types/v2.type"

//QUESTION: What the hell are we going to do with this ?? (capture device info ??)
//HMM: This can allow us to know if the device is down as it run every 30 second
//HMM: If the task isn't pingged after a minute, we consider the device down, and if not for 5 min then we consider the device off
//HMM: We need to generate a task file if a request is wanted (will be stored in results page)

export default (app: AppType) =>
  app.get(
    "/",
    async ({ query, cache }) => {
      const { sn, token } = query

      // Capture all info and cache them

      const deviceInfo = { ...query, lastPing: Date.now() }
      await cache.redis.hset(`device:${sn}`, deviceInfo)
      // schedule a thing that mark the device as down in 10 minute
      // cancel any previous device is down timer
      // check if there is a task file for the device (user request)

      const taskFile = await cache.redis.get(`tasks:${sn}`)

      // if there is then generate the task file and send it to the user
      if (taskFile) {
        // Delete the task after retrieving it
        await cache.redis.del(`tasks:${sn}`)
        return taskFile // Return the raw script file
      }

      return ""
    },
    { query: towerTasksQuery },
  )
