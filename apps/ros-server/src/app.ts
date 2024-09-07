import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookies from "cookie-parser";
import helmet from "helmet";

import "express-async-errors";

export const createApp = async () => {
  const app = express();

  // setup the middlewares
  app.use(morgan("tiny"));
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(cookies());

  // setup the routes (/api)


  return app;
};
