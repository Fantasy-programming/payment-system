import pulse from "../utils/pulse";
import logger from "../logger";

import { getPaymentMethod } from "../lib/paystack";

import { Transaction } from "../models/Transaction";
import { UserAlert } from "../models/UserPreference";

import type { ObjectId } from "mongoose";
import type { ICreateTransaction } from "../types/Transaction.type";
import type { IUser } from "../types/User.type";
import type { IProduct } from "../types/Product.type";
import { adminPreferences } from "../utils/preferences";

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
  const endDate = new Date(
    new Date().setMonth(startDate.getMonth() + trsc.months),
  );
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
  const state1 = await savedTransaction.populate<{ user: IUser }>("user");
  const state2 = await savedTransaction.populate<{ user: IProduct }>("product");

  // TODO: Setup scheduled task for recurring transactions

  UserAlert.findOne({ userId })
    .then((preferences) => {
      if (preferences?.receiptEmail) {
        // Send receipt email
        pulse.schedule("now", "send receipt email", {
          email: state1.user.email,
          userId: userId.toString(),
          userDetail: state1.user,
          productDetail: state2.product,
          transactionDetail: savedTransaction,
        });

        logger.info("🟢 Receipt email scheduled");
      }

      if (preferences?.subscriptionAlert) {
        if (preferences?.emailAlerts) {
          pulse.schedule("in 28 days", "send subscription reminder", {
            email: state1.user.email,
            number: state1.user.phone,
            alertType: "email",
            userId: userId.toString(),
          });

          logger.info("🟢 Subscription reminder scheduled");
        }

        if (preferences?.smsAlerts) {
          pulse.schedule("in 28 days", "send subscription reminder", {
            email: state1.user.email,
            number: state1.user.phone,
            alertType: "sms",
            userId: userId.toString(),
          });

          logger.info("🟢 Subscription reminder scheduled");
        }
      }
    })
    .catch((err) => {
      logger.error(
        "🔴 Error scheduling receipt and subscription reminder:",
        err,
      );
    });

  // Alert the admin of the new subscription
  if (adminPreferences?.activationAlert) {
    if (adminPreferences?.emailAlerts) {
      pulse.schedule("now", "subscription Alert", {
        email: adminPreferences?.activationAlertEmail,
        number: adminPreferences?.activationAlertPhone,
        alertType: "email",
        userDetail: state1.user,
        transactionDetail: savedTransaction,
        userId: userId.toString(),
      });
      logger.info("🟢 Subscription Alert scheduled");
    }

    if (adminPreferences?.smsAlerts) {
      pulse.schedule("now", "subscription Alert", {
        email: adminPreferences?.activationAlertEmail,
        number: adminPreferences?.activationAlertPhone,
        userDetail: state1.user,
        transactionDetail: savedTransaction,
        alertType: "sms",
        userId: userId.toString(),
      });
      logger.info("🟢 Subscription Alert scheduled");
    }
  }

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
