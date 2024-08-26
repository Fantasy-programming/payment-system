import winston from "winston";
import winstonDevConsole from "@epegzz/winston-dev-console";
import { NODE_ENV } from "./env";

// TODO: Rotate to elasticsearch

const transports: winston.transport[] = [];

if (NODE_ENV === "production") {
  transports.push(
    new winston.transports.Console({
      level: "http",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
    }),
  );

  transports.push(
    new winston.transports.File({
      filename: "api.log",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.json(),
      ),
    }),
  );
}

let logger = winston.createLogger({
  level: "debug",
  silent: NODE_ENV === "test",
  transports: transports,
});

if (NODE_ENV === "development") {
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
      logger.http(message.substring(0, message.lastIndexOf("\n")));
    } else {
      logger.http(message);
    }
  },
};

export default logger;
