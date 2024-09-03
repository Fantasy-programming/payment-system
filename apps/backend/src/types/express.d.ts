import type { Redis } from "ioredis";
import type Pulse from "@pulsecron/pulse";
import type { IUser } from "./user.type";
import type { Metrics } from "../adapters/prometheus.adapter";

declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: IUser;
    }

    interface Locals {
      scheduler: Pulse;
      cache: Redis;
      metrics: Metrics;
    }
  }
}

// Ensure this file is treated as a module
export {};
