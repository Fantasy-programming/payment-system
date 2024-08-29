import { Router } from "express";
import {
  validateData,
  validateParams,
} from "../middlewares/validation.middleware";
import { userExtractor } from "../middlewares/jwt.middleware";

import { idparam, idsSchema } from "../types/api.type";
import { createTransactionSchema } from "../types/transaction.type";

import trscController from "../controllers/transaction.controller";
import { checkCache } from "../middlewares/cache.middleware";

const transactionRouter = Router();

// Get all transactions
transactionRouter.get(
  "/",
  userExtractor,
  checkCache,
  trscController.getAllTransactions,
);

// Get a single transaction detail
transactionRouter.get(
  "/:id",
  userExtractor,
  checkCache,
  validateParams(idparam),
  trscController.getTransaction,
);

// Create a new transaction
transactionRouter.post(
  "/",
  userExtractor,
  validateData(createTransactionSchema),
  trscController.createTransaction,
);

// Delete a transaction
transactionRouter.delete(
  "/",
  userExtractor,
  validateData(idsSchema),
  trscController.deleteTransaction,
);

export default transactionRouter;
