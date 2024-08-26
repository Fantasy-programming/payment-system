import winston from "winston";

// TODO: Rotate to elasticsearch

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.json(),
  ),
  transports: [
    // Log to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      silent: process.env.NODE_ENV === "test",
    }),
    // Log to file (optional)
    new winston.transports.File({
      filename: "api.log",
      level: "error",
    }),
  ],
});

export const stream = {
  write: (message: unknown) => {
    if (typeof message === "string") {
      logger.info(message.substring(0, message.lastIndexOf("\n")));
    } else {
      logger.info(message);
    }
  },
};

export default logger;
