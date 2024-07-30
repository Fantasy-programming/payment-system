import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import config from "./lib/config.js";
import logger from "./lib/logger.js";
import { sendEmail } from "./script/sendSMS.js";

import "express-async-errors";

import userRouter from "./controllers/user.js";
import authRouter from "./controllers/auth.js";
import productRouter from "./controllers/products.js";
import transactionRouter from "./controllers/transaction.js";
import middleware from "./lib/middleware.js";

const app = express();

// connect to the DB
mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB", error.message);
  });

// setup the middlewares
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("dist_static"));
app.use(middleware.tokenExtractor);

// setup the routes (/api)
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/products", productRouter);

sendEmail();

// custom middlewares
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
