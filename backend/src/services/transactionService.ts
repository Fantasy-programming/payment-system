import type { ObjectId } from "mongoose";
import { Transaction } from "../models/Transaction";

import { getPaymentMethod } from "../lib/paystack";
import type { ICreateTransaction } from "../types/Transaction.type";

const getAll = async (role: string, id: ObjectId) => {
  if (role === "admin") {
    const transactions = await Transaction.find({});
    return transactions;
  }

  const transactions = await Transaction.find({ user: id });

  return transactions;
};

const getOne = async (id: string, role: string, userId: ObjectId) => {
  if (role === "admin") {
    const transaction = await Transaction.findById(id);
    return transaction;
  }

  const transaction = await Transaction.findOne({
    _id: id,
    user: userId,
  });
  return transaction;
};

const create = async (trsc: ICreateTransaction, userId: ObjectId) => {
  const startDate = new Date();
  const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));
  const medium = await getPaymentMethod(trsc.reference);

  const transaction = new Transaction({
    user: userId,
    product: trsc.productID,
    reference: trsc.reference,
    trxRef: trsc.trxRef,
    type: trsc.type,
    finalPrice: trsc.finalPrice,
    months: trsc.months,
    medium,
    recurring: trsc.recurring,
    startDate,
    endDate,
  });

  const savedTransaction = await transaction.save();

  // TODO: Setup scheduled task for recurring transactions
  // TODO: Send alert to admin and receipt to user
  // TODO: Setup scheduled task based on user and admin preferences

  return savedTransaction;
};

const remove = async (ids: ObjectId[] | ObjectId) => {
  let id = ids;

  if (!Array.isArray(ids)) {
    id = [ids];
  }

  await Transaction.deleteMany({ _id: { $in: id } });
};

export default { getAll, getOne, create, remove };
