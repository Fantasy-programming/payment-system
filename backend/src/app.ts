import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookies from "cookie-parser";
import helmet from "helmet";

import "express-async-errors";

import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import transactionRouter from "./routes/transaction.route";
import supportRouter from "./routes/support.route";
import preferenceRouter from "./routes/preference.route";
import mistRouter from "./routes/misc.route";

import { tokenExtractor } from "./middlewares/jwt.middleware";
import { errorHandler, unknownEndpoint } from "./middlewares/error.middleware";
import { stream } from "./logger";

import type { Db } from "./adapters/mongo.adapter";
import type { Scheduler } from "./adapters/pulse.adapter";
import type { Cache } from "./adapters/redis.adapter";

type AppDependencies = {
  db: Db;
  scheduler: Scheduler;
  cache: Cache;
};

export const createApp = async (dependencies: AppDependencies) => {
  const app = express();

  // setup dependencies
  await dependencies.db.init();
  await dependencies.scheduler.init();

  // port dependency accross the app
  app.locals.scheduler = dependencies.scheduler.pulse;
  app.locals.cache = dependencies.cache.redis;

  // setup the middlewares
  app.use(morgan("tiny", { stream }));
  app.use(cors());
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": [
            "'self'",
            "https://js.paystack.co/v1/inline.js",
            "https://checkout.paystack.com/cdn-cgi/challenge-platform/scripts/jsd/main.js",
          ],
          "frame-src": ["'self'", "https://checkout.paystack.com/"],
        },
      },
    }),
  );
  app.use(express.json());
  app.use(cookies());
  app.use(express.static("static"));
  app.use(tokenExtractor);

  // setup the routes (/api)
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/transactions", transactionRouter);
  app.use("/api/products", productRouter);
  app.use("/api/support", supportRouter);
  app.use("/api/preferences", preferenceRouter);
  app.use("*", mistRouter);

  // custom middlewares
  app.use(unknownEndpoint);
  app.use(errorHandler);

  return app;
};
