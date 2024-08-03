import { z } from "zod";
import { userSchema } from "./user.types";
import { productSchema } from "./product.types";

export const transactionSchema = z.object({
  id: z.string(),
  user: userSchema,
  product: productSchema,
  reference: z.string(),
  months: z.number(),
  finalPrice: z.number(),
  trxRef: z.string(),
  type: z.enum(["subscription", "top-up"]),
  medium: z.string(),
  recurring: z.boolean(),
  startDate: z.string(),
  endDate: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const transactionRequestSchema = transactionSchema
  .omit({
    id: true,
    user: true,
    product: true,
    medium: true,
    startDate: true,
    endDate: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({ productID: z.string() });

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionRequest = z.infer<typeof transactionRequestSchema>;
