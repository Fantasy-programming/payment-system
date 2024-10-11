import { Elysia, t } from "elysia"

export class PubSubManager {
  private subscriptionStore: Map<string, Set<string>>

  constructor() {
    this.subscriptionStore = new Map()
  }

  subscribe(id: string, channel: string): void {
    if (!this.subscriptionStore.has(id)) {
      this.subscriptionStore.set(id, new Set())
    }

    this.subscriptionStore.get(id)?.add(channel)
  }

  unsubscribe(id: string, channel: string): void {
    this.subscriptionStore.get(id)?.delete(channel)
  }

  unsubscribeAll(id: string): void {
    const subscriptions = this.subscriptionStore.get(id)

    if (subscriptions) {
      this.subscriptionStore.delete(id)
    }
  }

  getSubscriptions(wsId: string): Set<string> | undefined {
    return this.subscriptionStore.get(wsId)
  }

  hasSubscription(wsId: string, channel: string): boolean {
    return this.subscriptionStore.get(wsId)?.has(channel) ?? false
  }

  // Debug methods
  getAllSubscriptions(): Record<string, string[]> {
    const subscriptions: Record<string, string[]> = {}

    for (const [wsId, channels] of this.subscriptionStore.entries()) {
      subscriptions[wsId] = Array.from(channels)
    }

    return subscriptions
  }

  getSubscribersCount(channel: string): number {
    let count = 0
    for (const channels of this.subscriptionStore.values()) {
      if (channels.has(channel)) count++
    }
    return count
  }
}

const body = t.Object({
  type: t.Union([t.Literal("Subscribe"), t.Literal("Action")]),
  channel: t.Union([t.Literal("health"), t.Literal("user"), t.Literal("logs")]),
  device: t.String(),
})

export const ws = new Elysia({ name: "ws" })
  .decorate("pubsub", new PubSubManager())
  .ws("/api/v2/live", {
    type: "json",
    body: body,
    message: (ws, msg): void => {
      // step1: the user ask for some DataStream
      // step2: we verify that the user has right to the device
      // step3: if the task is health then we return the latest health data from cache

      if (msg.type == "Subscribe") {
        if (msg.channel == "health") {
          ws.data.pubsub.subscribe(ws.id, `$type:health$sn:${msg.device}`)
          ws.subscribe(`$type:health$sn:${msg.device}`)
          ws.send(JSON.stringify({ status: "pending" }))
        }
        if (msg.channel == "user") {
          ws.data.pubsub.subscribe(ws.id, `$type:user$sn:${msg.device}`)
          ws.subscribe(`$type:user$sn:${msg.device}`)
          ws.send(JSON.stringify({ status: "pending" }))
        }
        if (msg.channel == "logs") {
          ws.data.pubsub.subscribe(ws.id, `$type:logs$sn:${msg.device}`)
          ws.subscribe(`$type:logs$sn:${msg.device}`)
          ws.send(JSON.stringify({ status: "pending" }))
        }
      }

      // step4: if the task is a custom one then we genrate an action file to be served and we monitor (each 5s) if a result is in the cache
      // if the result is in the cache we send it to the user, else we send a pending status, if the user close the connection or there is nothing after 10s we send an error then stop
      if (msg.type == "Action") {
        ws.send(JSON.stringify({ status: "pending" }))
      }
    },

    close: (ws) => {
      const subscriptions = ws.data.pubsub.getSubscriptions(ws.id)
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
