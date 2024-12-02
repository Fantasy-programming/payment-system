import express from "express"
import morgan from "morgan"
import cors from "cors"
import cookies from "cookie-parser"
import helmet from "helmet"

import "express-async-errors"

import userRouter from "./routes/user.route"
import authRouter from "./routes/auth.route"
import productRouter from "./routes/product.route"
import transactionRouter from "./routes/transaction.route"
import supportRouter from "./routes/support.route"
import preferenceRouter from "./routes/preference.route"
import metricRouter from "./routes/metric.route"

import { requestCounter } from "./middlewares/metric.middleware"
import { tokenExtractor } from "./middlewares/jwt.middleware"
import { errorHandler, unknownEndpoint } from "./middlewares/error.middleware"

import type { Db } from "./adapters/mongo.adapter"
import type { Scheduler } from "./adapters/pulse.adapter"
import type { Cache } from "./adapters/redis.adapter"
import type { Metrics } from "./adapters/prometheus.adapter"
import type { Logger } from "@mikronet/logger"

type AppDependencies = {
  log: Logger
  db: Db
  scheduler: Scheduler
  cache: Cache
  metrics: Metrics
}

export const createApp = async (dependencies: AppDependencies) => {
  const app = express()

  // setup dependencies
  await dependencies.db.init()
  await dependencies.scheduler.init()

  // port dependency accross the app
  app.locals.scheduler = dependencies.scheduler.pulse
  app.locals.cache = dependencies.cache.redis
  app.locals.metrics = dependencies.metrics
  app.locals.log = dependencies.log.logger

  // setup the middlewares
  app.use(requestCounter)
  app.use(morgan("tiny", { stream: dependencies.log.stream() }))
  app.use(cors())
  app.use(helmet())
  app.use(express.json())
  app.use(cookies())
  app.use(tokenExtractor)

  // setup the routes (/api)
  app.use("/api/users", userRouter)
  app.use("/api/auth", authRouter)
  app.use("/api/transactions", transactionRouter)
  app.use("/api/products", productRouter)
  app.use("/api/support", supportRouter)
  app.use("/api/preferences", preferenceRouter)
  app.use("/api/metrics", metricRouter)

  // custom middlewares
  app.use(unknownEndpoint)
  app.use(errorHandler)

  return app
}
