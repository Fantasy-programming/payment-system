import express from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"

import "express-async-errors"

import userRouter from "./routes/user.route"

import { errorHandler, unknownEndpoint } from "./middlewares/error.middleware"
import { Log } from "./utils/logger"

type AppDependencies = {}

export const createApp = async (dependencies: AppDependencies) => {
  const app = express()

  // setup dependencies

  app.use(morgan("tiny", { stream: Log.stream() }))
  app.use(cors())
  app.use(helmet())
  app.use(express.json())

  // setup the routes (/api)
  app.use("/api/users", userRouter)

  // custom middlewares
  app.use(unknownEndpoint)
  app.use(errorHandler)

  return app
}
