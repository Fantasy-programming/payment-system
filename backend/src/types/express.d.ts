import type { Redis } from "ioredis";
import type Pulse from "@pulsecron/pulse";
import type { IUser } from "./User.type";

declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: IUser;
    }

    interface Locals {
      scheduler: Pulse;
      cache: Redis;
    }
  }
}

// Ensure this file is treated as a module
export {};
