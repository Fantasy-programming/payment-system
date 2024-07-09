const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./lib/config");
const logger = require("./lib/logger");

require("express-async-errors");
const userRouter = require("./controllers/user");

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

// setup the routes (/api)
app.use("/api/users", userRouter);

// custom middlewares

module.exports = app;
