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

import { tokenExtractor } from "./middleware/jwt";
import { errorHandler, unknownEndpoint } from "./middleware/errorHandler";

import { initDB } from "./utils/mongo";
import { initPulse } from "./utils/pulse";

const app = express();

// connect to the DB
await initDB();
await initPulse();

// setup the middlewares
app.use(morgan("tiny"));
app.use(cors());
app.use(helmet());
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

export default app;
