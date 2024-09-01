import winston from "winston";
import winstonDevConsole from "@epegzz/winston-dev-console";
import LokiTransport from "winston-loki";
import safeJsonStringify from "safe-json-stringify";
import env from "./env";

// NOTE: Rotate to elasticsearch (overkill mode)

const transports: winston.transport[] = [];

// but good practice say you should not couple with this specific nya nya nya (not time bro)
if (env.NODE_ENV !== "development") {
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
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  );
}

transports.push(
  new LokiTransport({
    host: env.LOKI_URI,
    format: winston.format.combine(
      winston.format.printf((info) => {
        return typeof info === "object" ? safeJsonStringify(info) : info;
      }),
    ),
  }),
);

let logger = winston.createLogger({
  level: "silly",
  silent: env.NODE_ENV === "testing",
  transports: transports,
});

if (
  env.NODE_ENV === "development" &&
  typeof winstonDevConsole.init === "function"
) {
  logger = winstonDevConsole.init(logger);
  logger.add(
    winstonDevConsole.transport({
      showTimestamps: false,
      addLineSeparation: true,
    }),
  );
}

// logstream for morgan
export const stream = {
  write: (message: unknown) => {
    if (typeof message === "string") {
      logger.http(message.trim());
    } else {
      logger.http(message);
    }
  },
};

export default logger;
