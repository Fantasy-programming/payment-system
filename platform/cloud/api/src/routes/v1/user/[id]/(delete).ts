import type { AppType } from "@/app"
import { newUserSchema } from "@/types/user.type"
import { RouterOSApi } from "@mikcloud/routeros"

export default (app: AppType) =>
  app.delete(
    "/",
    async ({ params: { id } }) => {
      const router = new RouterOSApi("192.168.100.2", 8728, false)

      try {
        await router.login("admin", "chelito92")
        await router.talk("/ip/hotspot/user/remove", { ".id": id }, false)

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
        summary: "Delete User",
        description: "Delete the user with the given id",
        tags: ["Users"],
      },
    },
  )
