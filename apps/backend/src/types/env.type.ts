import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().min(1000),
  NODE_ENV: z
    .union([
      z.literal("development"),
      z.literal("testing"),
      z.literal("production"),
    ])
    .default("development"),
  MONGODB_URI: z.string().url(),
  REDIS_URI: z.string().url(),
  LOKI_URI: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  ARKESEL_API_KEY: z.string().min(1),
  PAYSTACK_SECRET_KEY: z.string().min(1),
  MAIL_SERVICE: z.string().min(1),
  MAIL_USERNAME: z.string().min(1),
  MAIL_CLIENTID: z.string().min(1),
  MAIL_CLIENT_SECRET: z.string().min(1),
  MAIL_REFRESH_TOKEN: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;
