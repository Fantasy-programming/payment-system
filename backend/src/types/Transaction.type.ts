import { z } from "zod";
import { Model } from "mongoose";
import { createObjectId } from "./Api.type";

export const transactionSchema = z.object({
  id: createObjectId("invalid ID"),
  user: createObjectId("invalid user ID"),
  product: createObjectId("invalid product ID"),
  reference: z.string(),
  trxRef: z.string(),
  type: z.enum(["subscription", "top-up"]),
  medium: z.string(),
  recurring: z.boolean(),
  startDate: z.date(),
  endDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createTransactionSchema = transactionSchema
  .omit({
    id: true,
    startDate: true,
    user: true,
    product: true,
    endDate: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    productID: createObjectId("invalid product ID"),
  });

export type ITransaction = z.infer<typeof transactionSchema>;
export type ICreateTransaction = z.infer<typeof createTransactionSchema>;
export type TransactionModel = Model<ITransaction>;
