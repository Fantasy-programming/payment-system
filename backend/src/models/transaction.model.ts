import { Schema, model } from "mongoose";
import type { ITransaction, TransactionModel } from "../types/transaction.type";

// TODO: Scout the app to reflect the schema changes
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
  duration: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  reference: { type: String, required: true },
  trxRef: { type: String, required: true },
  type: {
    type: String,
    enum: ["onetime", "top-up", "prepaid"],
    required: true,
  },
  medium: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

transactionSchema.pre("find", function (next) {
  this.populate("product").populate("user").sort({ createdAt: -1 });
  next();
});

transactionSchema.pre("findOne", function (next) {
  this.populate("product").populate("user").sort({ createdAt: -1 });
  next();
});

transactionSchema.post("save", async function (doc, next) {
  await doc.populate("product");
  await doc.populate("user");
  next();
});

transactionSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.deletedAt;
    delete returnedObject.createdBy;
    delete returnedObject.updatedBy;
  },
});

export const Transaction: TransactionModel = model<
  ITransaction,
  TransactionModel
>("Transaction", transactionSchema);
