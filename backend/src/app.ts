import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookies from "cookie-parser";
import helmet from "helmet";

import "express-async-errors";

import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import transactionRouter from "./routes/transaction";
import supportRouter from "./routes/support";
import preferenceRouter from "./routes/preference";
import mistRouter from "./routes/mist";

import { tokenExtractor } from "./middlewares/jwt";
import { errorHandler, unknownEndpoint } from "./middlewares/errorHandler";

import type { DB } from "./adapters/mongo";
import type { Scheduler } from "./adapters/pulse";
import { stream } from "./logger";

type AppDependencies = {
  db: DB;
  scheduler: Scheduler;
};

export const createApp = async (dependencies: AppDependencies) => {
  const app = express();

  // setup dependencies
  await dependencies.db.init();
  await dependencies.scheduler.init();

  // port dependency accross the app
  app.locals.scheduler = dependencies.scheduler.pulse;

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
