import { z } from "zod";
import { Model } from "mongoose";
import { createObjectId } from "./Api.type";
import { userSchema } from "./User.type";
import { productSchema } from "./Product.type";

export const transactionSchema = z.object({
  _id: createObjectId("invalid ID"),
  user: createObjectId("invalid user ID"),
  product: createObjectId("invalid product ID"),
  finalPrice: z.number(),
  duration: z.number(),
  reference: z.string({ required_error: "Reference is required" }),
  trxRef: z.string(),
  type: z.enum(["onetime", "top-up", "prepaid"]),
  medium: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  createdBy: createObjectId("invalid user ID"),
  updatedBy: createObjectId("invalid user ID"),
});

export const fullTransactionSchema = transactionSchema.extend({
  user: userSchema,
  product: productSchema,
});

export const createTransactionSchema = transactionSchema
  .omit({
    _id: true,
    user: true,
    product: true,
    startDate: true,
    medium: true,
    endDate: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    createdBy: true,
    updatedBy: true,
  })
  .extend({
    productID: createObjectId("invalid product ID"),
  });

export type ITransaction = z.infer<typeof transactionSchema>;
export type IFullTransaction = z.infer<typeof fullTransactionSchema>;
export type ICreateTransaction = z.infer<typeof createTransactionSchema>;
export type TransactionModel = Model<ITransaction>;
