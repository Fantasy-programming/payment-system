import winston from "winston"
import winstonDevConsole from "@epegzz/winston-dev-console"
import LokiTransport from "winston-loki"
import safeJsonStringify from "safe-json-stringify"

interface LoggerOptions {
  env: "development" | "test" | "production"
  lokiUri: string
}

type LogInstance = winston.Logger

export class Logger {
  public logger: LogInstance

  constructor({ env, lokiUri }: LoggerOptions) {
    const transports: winston.transport[] = []

    if (env !== "development") {
      transports.push(
        new winston.transports.Console({
          level: "http",
          format: winston.format.combine(
            winston.format.timestamp({
              format: "YYYY-MM-DD HH:mm:ss",
            }),
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf(({ level, message, timestamp }) => {
              return `${timestamp} [${level}]: ${message}`
            }),
          ),
        }),
      )
    }

    transports.push(
      new LokiTransport({
        host: lokiUri,
        format: winston.format.combine(
          winston.format.printf((info) => {
            return typeof info === "object" ? safeJsonStringify(info) : info
          }),
        ),
      }),
    )

    this.logger = winston.createLogger({
      level: "silly",
      silent: env === "test",
      transports: transports,
    })

    if (env === "development" && winstonDevConsole) {
      this.logger = winstonDevConsole.init(this.logger)
      this.logger.add(
        winstonDevConsole.transport({
          showTimestamps: false,
          addLineSeparation: true,
        }),
      )
    }
  }

  public stream() {
    return {
      write: (message: unknown) => {
        if (typeof message === "string") {
          this.logger.http(message.trim())
        } else {
          this.logger.http(message)
        }
      },
    }
  }
}
