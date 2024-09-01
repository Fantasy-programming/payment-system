import { envSchema, type Env } from "./types/env.type";

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  console.error(error);
  process.exit(1);
}

export default env;
