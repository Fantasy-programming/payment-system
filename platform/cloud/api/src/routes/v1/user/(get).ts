import type { AppType } from "@/app"
import { usersArraySchema, type User, type UsersArray } from "@/types/user.type"
import { RouterOSApi } from "@mikcloud/routeros"
import { Value } from "@sinclair/typebox/value"

export default (app: AppType) =>
  app.get(
    "/",
    async () => {
      const router = new RouterOSApi("192.168.100.2", 8728, false)

      try {
        await router.login("admin", "chelito92")

        const rawData = await router.talk("/ip/hotspot/user/print")
        const users = rawData.filter((user: any) => user.name !== "default-trial").map(parseUser)
        return Value.Convert(usersArraySchema, users) as UsersArray
      } finally {
        router.close()
      }
    },
    {
      detail: {
        summary: "Get Users",
        description: "Get all users accounts in the router",
        tags: ["Users"],
      },
      response: usersArraySchema,
    },
  )

function parseUser(user: any): User {
  const { ".id": id, comment, name, ...rest } = user

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
    id, // Renaming .id to id
    name,
    comment,
    startDate,
    endDate,
    ...rest,
  }
}
