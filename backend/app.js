const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./lib/config");
const logger = require("./lib/logger");
const sendMail = require("./script/sendSMS");

require("express-async-errors");
const userRouter = require("./controllers/user");
const authRouter = require("./controllers/auth");
const productRouter = require("./controllers/products");
const transactionRouter = require("./controllers/transaction");
const middleware = require("./lib/middleware");

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

sendMail();

// custom middlewares
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
