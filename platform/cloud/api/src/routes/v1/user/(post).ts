import { t } from "elysia"
import type { AppType } from "@/app"
import { newUserSchema } from "@/types/user.type"
import { RouterOSApi } from "@mikcloud/routeros"

export default (app: AppType) =>
  app.post(
    "/",
    async ({ body }) => {
      const router = new RouterOSApi("192.168.100.2", 8728, false)

      try {
        await router.login("admin", "chelito92")
        await router.talk("/ip/hotspot/user/add", body, false)

        return {
          message: "user created successfully",
        }
      } finally {
        router.close()
      }
    },
    {
      body: newUserSchema,
      detail: {
        summary: "Create User",
        description: "Create a new user in the router",
        tags: ["Users"],
      },
      response: t.Object({
        message: t.String(),
      }),
    },
  )
