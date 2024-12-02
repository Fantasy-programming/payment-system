import type { PluginContext } from "@/plugins"
import type { WS } from "@/plugins/pubsub"
import { wsPayloadSchema, type WSActionSchema, type WSSubSchema } from "@/types/v2.type"
import { MikrotikScriptGenerator } from "@/utils/scripts"
import { Elysia } from "elysia"
import { monitorResults } from "./websocket.lib"
import env from "@/env"
import { catchError } from "@/utils/promise"

//NOTE: We may remove the pending ??
//NOTE: We may remove the type string

const handleSubscribe = async (ws: WS, message: WSSubSchema) => {
  const context = ws.data as PluginContext

  if (message.channel == "health") {
    context.pubsub.subscribe(ws, `$type:health$sn:${message.device}`)
    context.pubsub.send(ws, { status: "pending" })
  }

  if (message.channel == "user") {
    context.pubsub.subscribe(ws, `$type:user$sn:${message.device}`)
    context.pubsub.send(ws, { status: "pending" })
  }

  if (message.channel == "logs") {
    context.pubsub.subscribe(ws, `$type:logs$sn:${message.device}`)
    context.pubsub.send(ws, { status: "pending" })
  }
}

const handleAction = async (ws: WS, message: WSActionSchema) => {
  const context = ws.data as PluginContext

  context.pubsub.send(ws, { status: "pending" })

  // Generate the action file
  const builder = new MikrotikScriptGenerator({
    serverUrl: env.LIVE_URL,
    sn: message.device,
    token: message.token,
  })

  const script = await builder.generateInfoScript("active-users")
  const [err] = await catchError(context.cache.redis.set(`tasks:${message.device}`, script))

  if (err) {
    throw new Error(`Redis went wrong: ${err}`)
  }

  context.pubsub.send(ws, { status: "pending", message: "task scheduled" })

  const onResult = (results: unknown) => {
    context.pubsub.send(ws, { status: "success", results })
    ws.close()
  }

  const onTimeout = () => {
    context.pubsub.send(ws, { status: "error", message: "timeout waiting for results" })
    ws.close()
  }

  // Monitor the cache for the result
  monitorResults(context.cache.redis, message.device, onResult, onTimeout)
}

// TODO: we verify that the user has right to the device
export const ws = new Elysia({ name: "ws" })
  .ws("/api/v2/live", {
    type: "json",
    body: wsPayloadSchema,
    message: async (ws, msg): Promise<void> => {
      if (msg.type == "Subscribe") {
        handleSubscribe(ws, msg)
      }

      if (msg.type == "Action") {
        handleAction(ws, msg)
      }
    },
    close: (ws) => {
      const context = ws.data as PluginContext
      const subscriptions = context.pubsub.getSubscriptions(ws.id)

      subscriptions?.forEach((channel) => {
        console.log(`Unsubscribing ${ws.id} from ${channel}`)
        ws.unsubscribe(channel)
      })
    },
  })
  .derive({ as: "global" }, ({ server }) => ({
    sendWs(channel: string, data: unknown) {
      try {
        const payload = JSON.stringify(data)
        server?.publish(channel, payload)
      } catch (error) {
        console.error("Error sending message:", error)
        throw error
      }
    },
  }))
