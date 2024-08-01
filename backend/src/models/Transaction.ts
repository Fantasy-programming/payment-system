import { Schema, model } from "mongoose";
import type { ITransaction, TransactionModel } from "../types/Transaction.type";

const transactionSchema = new Schema<ITransaction, TransactionModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  reference: { type: String, required: true },
  trxRef: { type: String, required: true },
  type: { type: String, enum: ["subscription", "top-up"], required: true },
  medium: { type: String, required: true },
  recurring: { type: Boolean, default: false },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

transactionSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Transaction: TransactionModel = model<
  ITransaction,
  TransactionModel
>("Transaction", transactionSchema);
