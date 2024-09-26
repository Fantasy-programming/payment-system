import type { Redis } from "ioredis"
import type Pulse from "@pulsecron/pulse"
import type { IUser } from "./user.type"
import type { Metrics } from "../adapters/prometheus.adapter"
import type { LogInstance } from "@mikronet/logger"

declare global {
  namespace Express {
    interface Request {
      token?: string
      user?: IUser
    }

    interface Locals {
      scheduler: Pulse
      cache: Redis
      metrics: Metrics
      log: LogInstance
    }
  }
}

// Ensure this file is treated as a module
export {}
