import { Router } from "express";
import { validateData, validateParams } from "../middleware/validation";
import { userExtractor } from "../middleware/jwt";

import { idparam, idsSchema } from "../types/Api.type";
import { createTransactionSchema } from "../types/Transaction.type";

import trscController from "../controllers/transactionController";

const transactionRouter = Router();

// Get all transactions
transactionRouter.get("/", userExtractor, trscController.getAllTransactions);

// Get a single transaction detail
transactionRouter.get(
  "/:id",
  userExtractor,
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
