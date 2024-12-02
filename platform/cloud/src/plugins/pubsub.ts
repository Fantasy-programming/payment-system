import type { ServerWebSocket } from "bun"
import { TypeCheck } from "elysia/type-system"
import { Elysia, type TSchema } from "elysia"
import { ElysiaWS } from "elysia/ws"

export type WS = ElysiaWS<
  ServerWebSocket<{
    validator?: TypeCheck<TSchema>
  }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>

export class PubSubManager {
  private subscriptionStore: Map<string, Set<string>>

  constructor() {
    this.subscriptionStore = new Map()
  }

  subscribe(ws: WS, channel: string): void {
    if (!this.subscriptionStore.has(ws.id)) {
      this.subscriptionStore.set(ws.id, new Set())
    }

    ws.subscribe(channel)
    this.subscriptionStore.get(ws.id)?.add(channel)
  }

  unsubscribe(id: string, channel: string): void {
    this.subscriptionStore.get(id)?.delete(channel)
  }

  send(ws: WS, data: unknown) {
    const payload = JSON.stringify(data)
    ws.send(payload)
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

export const pubSubPlugin = new Elysia({ name: "pubsub" }).decorate("pubsub", new PubSubManager())
