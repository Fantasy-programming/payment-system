import { TypeCompiler } from "@sinclair/typebox/compiler"
import { envSchema, type Env } from "./types/env.type"
import { Value } from "@sinclair/typebox/value"

let env: Env

const EnvSchema = TypeCompiler.Compile(envSchema)

try {
  const cenv = Value.Clone(process.env)
  const cleanenv = Value.Convert(envSchema, cenv) as NodeJS.ProcessEnv

  env = EnvSchema.Decode(cleanenv)
} catch (error) {
  console.error(error)
  process.exit(1)
}

export default env
