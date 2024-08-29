import logger from "../logger";
import { add, isAfter, subDays } from "date-fns";

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

  const transactions = await Transaction.find({ user: id }).sort({
    createdAt: -1,
  });
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
  let startDate = new Date();
  let endDate = add(startDate, { months: trsc.duration });
  const medium = await getPaymentMethod(trsc.reference);

  if (trsc.type !== "onetime") {
    const activeSubscription = await Transaction.findOne({
      user: userId,
      endDate: { $gt: new Date() },
    });

    if (activeSubscription) {
      if (trsc.type === "prepaid") {
        if (
          activeSubscription.type === "prepaid" &&
          isAfter(activeSubscription.startDate, new Date())
        ) {
          startDate = activeSubscription.endDate;
          endDate = add(activeSubscription.endDate, { months: trsc.duration });
        } else if (
          activeSubscription.type === "prepaid" &&
          activeSubscription.startDate <= new Date()
        ) {
          startDate = activeSubscription.endDate;
          endDate = add(activeSubscription.endDate, { months: trsc.duration });
        } else if (activeSubscription.type !== "prepaid") {
          // check if there is a prepaid subscription that hasn't started
          const currentSubscription = await Transaction.findOne({
            user: userId,
            type: "prepaid",
            endDate: { $gt: new Date() },
          });

          if (currentSubscription) {
            startDate = currentSubscription.endDate;
            endDate = add(currentSubscription.endDate, {
              months: trsc.duration,
            });
          } else {
            startDate = activeSubscription.endDate;
            endDate = add(activeSubscription.endDate, {
              months: trsc.duration,
            });
          }
        }
      } else if (trsc.type === "top-up") {
        if (
          activeSubscription.type === "prepaid" &&
          isAfter(activeSubscription.startDate, new Date())
        ) {
          const currentSubscription = await Transaction.findOne({
            user: userId,
            endDate: { $gt: new Date() },
          })
            .sort({ endDate: -1 })
            .skip(1);

          if (currentSubscription) {
            startDate = currentSubscription.startDate;
            endDate = currentSubscription.endDate;
          }
        } else if (
          activeSubscription.type === "prepaid" &&
          activeSubscription.startDate <= new Date()
        ) {
          startDate = activeSubscription.startDate;
          endDate = activeSubscription.endDate;
        } else if (activeSubscription.type !== "prepaid") {
          startDate = activeSubscription.startDate;
          endDate = activeSubscription.endDate;
        }
      }
    }
  }

  const transaction = new Transaction({
    user: userId,
    product: trsc.productID,
    duration: trsc.duration,
    finalPrice: trsc.finalPrice,
    reference: trsc.reference,
    trxRef: trsc.trxRef,
    type: trsc.type,
    medium,
    startDate,
    endDate,
    createdBy: userId,
    updatedBy: userId,
  });

  let savedTransaction = await transaction.save();
  savedTransaction = await savedTransaction.toObject();
  logger.debug("Transaction created", savedTransaction);

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
          pulse.schedule(
            subDays(savedTransaction.endDate, 2),
            "send subscription reminder",
            {
              userDetail: savedTransaction.user,
              alertType: "email",
            },
          );

          logger.info("🟢 Subscription reminder scheduled");
        }

        if (preferences?.smsAlerts) {
          pulse.schedule(
            subDays(savedTransaction.endDate, 2),
            "send subscription reminder",
            {
              userDetail: savedTransaction.user,
              alertType: "sms",
            },
          );

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
