import pino, { type LoggerOptions } from "pino"
import type { LokiOptions } from "pino-loki"

interface MikcloudLoggerOpts extends LoggerOptions {
  lokiUri: string
}

type LogInstance = pino.Logger

// TODO: Add auth
export class Logger {
  public logger: LogInstance
  public options: LoggerOptions

  constructor({ lokiUri, formatters, serializers, level }: MikcloudLoggerOpts) {
    const isProduction = process.env.NODE_ENV === "production"

    const transports = [
      pino.transport<LokiOptions>({
        target: "pino-loki",
        options: {
          batching: true,
          interval: 5,

          host: lokiUri,
          // basicAuth: {
          //   username: "username",
          //   password: "password",
          // },
        },
      }),
    ]

    if (!isProduction) {
      transports.push({
        target: "pino-pretty",
        options: { colorize: true },
      })
    }

    this.options = {
      formatters: formatters,
      serializers: serializers,
      level: level ?? "debug",
      transport: {
        targets: transports,
      },
    }

    this.logger = pino(this.options)
  }

  getOptions() {
    return this.options
  }
}
