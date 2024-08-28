import logger from "../logger";

import { getPaymentMethod } from "../lib/paystack";
import { adminPreferences } from "../utils/preferences";

import { Transaction } from "../models/Transaction";
import { UserAlert } from "../models/UserPreference";

import type { ObjectId } from "mongoose";
import type { ICreateTransaction } from "../types/Transaction.type";
import type Pulse from "@pulsecron/pulse";

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

const create = async (
  trsc: ICreateTransaction,
  userId: ObjectId,
  pulse: Pulse,
) => {
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

  let savedTransaction = await transaction.save();
  savedTransaction = await savedTransaction.toObject();
  logger.debug("Transaction created", savedTransaction);

  // NOTE: Setup scheduled task for recurring transactions (subscription)

  UserAlert.findOne({ userId })
    .then((preferences) => {
      if (preferences?.receiptEmail) {
        // Send receipt email
        pulse.now("send receipt email", {
          transactionDetail: savedTransaction,
        });

        logger.info("🟢 Receipt email scheduled");
      }

      if (preferences?.subscriptionAlert) {
        if (preferences?.emailAlerts) {
          pulse.schedule("in 28 days", "send subscription reminder", {
            userDetail: savedTransaction.user,
            alertType: "email",
          });

          logger.info("🟢 Subscription reminder scheduled");
        }

        if (preferences?.smsAlerts) {
          pulse.schedule("in 28 days", "send subscription reminder", {
            userDetail: savedTransaction.user,
            alertType: "sms",
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
      pulse.now("subscription Alert", {
        alertType: "email",
        transactionDetail: savedTransaction,
      });
      logger.info("🟢 Subscription Alert scheduled");
    }

    if (adminPreferences?.smsAlerts) {
      pulse.now("subscription Alert", {
        alertType: "sms",
        transactionDetail: savedTransaction,
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
