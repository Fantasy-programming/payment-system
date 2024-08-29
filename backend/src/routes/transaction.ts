import { Router } from "express";
import { validateData, validateParams } from "../middlewares/validation";
import { userExtractor } from "../middlewares/jwt";

import { idparam, idsSchema } from "../types/Api.type";
import { createTransactionSchema } from "../types/Transaction.type";

import trscController from "../controllers/transactionController";
import { checkCache } from "../middlewares/cache";

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
