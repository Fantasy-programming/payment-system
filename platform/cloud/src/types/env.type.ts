import { t, type Static } from "elysia"

export const envSchema = t.Object({
  LIVE_URL: t.String({ format: "uri" }),
  PORT: t.Number({ minimum: 1000 }),
  NODE_ENV: t.Union([t.Literal("development"), t.Literal("test"), t.Literal("production")], { default: "development" }),
  LOKI_URI: t.String({ format: "uri" }),
  REDIS_URI: t.String({ format: "uri" }),
})

export type Env = Static<typeof envSchema>
