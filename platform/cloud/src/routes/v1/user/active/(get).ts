import type { AppType } from "@/app"
import { activeusersArraySchema, type ActiveUser, type ActiveUsersArray } from "@/types/user.type"
import { RouterOSApi } from "@mikcloud/routeros"
import { Value } from "@sinclair/typebox/value"

export default (app: AppType) =>
  app.get(
    "/",
    async () => {
      const router = new RouterOSApi("192.168.100.2", 8728, false)

      try {
        await router.login("admin", "chelito92")

        const rawData = await router.talk("/ip/hotspot/active/print")
        const users = rawData.map(parseActiveUsers)
        return Value.Convert(activeusersArraySchema, users) as ActiveUsersArray
      } finally {
        router.close()
      }
    },
    {
      detail: {
        summary: "Get Active",
        description: "Get all users currently connected on the network",
        tags: ["Users"],
      },
      response: activeusersArraySchema,
    },
  )

function parseActiveUsers(user: any): ActiveUser {
  const { ".id": id, comment, ...rest } = user

  let startDate: string | undefined
  let endDate: string | undefined

  if (comment) {
    const regex = /(\w{3}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2})\s-\s"(\w{3}\/\d{2}\/\d{4})"\s\s(\d{2}:\d{2}:\d{2})/
    const match = comment.match(regex)

    if (match) {
      startDate = new Date(match[1]).toISOString()
      endDate = new Date(match[2]).toISOString()
    }
  }

  return {
    id,
    comment,
    startDate,
    endDate,
    ...rest,
  }
}
