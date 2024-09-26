import env from "../env"
import { Logger } from "@mikcloud/logger"

export const Log = new Logger({ lokiUri: env.LOKI_URI })
