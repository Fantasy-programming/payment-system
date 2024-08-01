import express from "express";
import morgan from "morgan";
import cors from "cors";

import "express-async-errors";

import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import transactionRouter from "./routes/transaction";

import { tokenExtractor } from "./middleware/jwt";
import { errorHandler, unknownEndpoint } from "./middleware/errorHandler";

import { initDB } from "./utils/initDB";

const app = express();

// connect to the DB
await initDB();

// setup the middlewares
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("static"));
app.use(tokenExtractor);

// setup the routes (/api)
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/products", productRouter);

// custom middlewares
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
