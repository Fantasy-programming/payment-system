import transactionService from "../services/transactionService";
import logger from "../logger";

import type { Request, Response } from "express";
import type { ICreateTransaction } from "../types/Transaction.type";
import type { Ids } from "../types/Api.type";
import { invalidateCache } from "../middlewares/cache";

const getAllTransactions = async (request: Request, response: Response) => {
  const role = request?.user?.role;
  const id = request?.user?._id;

  logger.debug(`role: ${role}, id: ${id}`);

  if (!role || !id) return response.status(401).json({ error: "Unauthorized" });

  const transactions = await transactionService.getAll(role, id);

  return response.json(transactions);
};

const getTransaction = async (request: Request, response: Response) => {
  const role = request?.user?.role;
  const userId = request?.user?._id;
  const id = request.params.id;

  if (!role || !userId)
    return response.status(401).json({ error: "Unauthorized" });
  if (!id)
    return response.status(400).json({ error: "Transaction ID is required" });

  const transaction = await transactionService.getOne(id, role, userId);

  if (!transaction) return response.status(404).json({ error: "Not found" });

  return response.json(transaction);
};

const createTransaction = async (request: Request, response: Response) => {
  const userId = request?.user?._id;
  const body = request.body as ICreateTransaction;
  const pulse = request.app.locals.scheduler;
  const redis = request.app.locals.cache;

  if (!userId) return response.status(401).json({ error: "Unauthorized" });

  const data = await transactionService.create(body, userId, pulse);
  await invalidateCache(redis, "transactions");
  return response.json(data);
};

const deleteTransaction = async (request: Request, response: Response) => {
  const { ids } = request.body as Ids;
  const role = request?.user?.role;
  const redis = request.app.locals.cache;

  if (!role || role !== "admin")
    return response.status(403).json({ error: "Unauthorized" });

  await transactionService.remove(ids);
  await invalidateCache(redis, "transactions");
  return response.status(204).end();
};

export default {
  getAllTransactions,
  getTransaction,
  createTransaction,
  deleteTransaction,
};
