import { sendMail } from "../lib/mail";
import sms from "../lib/sms";

import { Pulse } from "@pulsecron/pulse";
import logger from "../logger";
import { getConnection } from "./mongo";
import type { IUser } from "../types/User.type";
import type { IProduct } from "../types/Product.type";
import type { ITransaction } from "../types/Transaction.type";

const pulse = new Pulse();

/**
 * Initializes the Pulse monitoring tool.
 * It sets up a connection to the MongoDB database, configures Pulse to monitor the "jobs" collection,
 * sets up job handlers, and starts Pulse.
 *
 * @throws Will throw an error if the MongoDB connection cannot be established.
 */

export const initPulse = async () => {
  const connection = await getConnection();
  pulse.mongo(connection, "jobs");
  logger.info("🟢 Setting up Pulse...");
  setupJobs();
  pulse.start();
  logger.info("🟢 Pulse started");
};

interface SubReminderJob {
  email: string;
  number: string;
  alertType: string;
  userId: string;
}

interface AdminAlertJob {
  email: string;
  number: string;
  alertType: string;
  transactionDetail: ITransaction;
  userDetail: IUser;
  userId: string;
}

interface ReceiptJob {
  email: string;
  userDetail: IUser;
  productDetail: IProduct;
  transactionDetail: ITransaction;
}

/**
 * Sets up Pulse jobs.
 */

const setupJobs = () => {
  // Send Subscription Reminder
  pulse.define<SubReminderJob>("send subscription reminder", async (job) => {
    const { email, number, alertType } = job.attrs.data;

    if (alertType === "email") {
      await sendMail(
        email,
        "Subscription Alert",
        "Your subscription is ending in 2 days",
      );
    } else if (alertType === "sms") {
      await sms.sendSMS("Your subscription is ending in 2 days", number);
    }
  });

  //TODO: Render the email with the transaction detail

  // Send Receipt + attachment to Email
  pulse.define<ReceiptJob>("send receipt email", async (job) => {
    const { email, userDetail, productDetail, transactionDetail } =
      job.attrs.data;

    await sendMail(
      email,
      "Receipt",
      `Hello ${userDetail.firstName} ${userDetail.lastName}, 
      Your transaction for ${productDetail.name} was successful. 
      Transaction ID: ${transactionDetail?.id}`,
    );
  });

  //TODO: Render a good mail template
  // Send Subscription Alert to the admin
  pulse.define<AdminAlertJob>("subscription Alert", async (job) => {
    const { email, number, alertType } = job.attrs.data;

    if (alertType === "email") {
      await sendMail(
        email,
        "Subscription Alert",
        "The user with routerID: abcd has purchased a subscription",
      );
    } else if (alertType === "sms") {
      await sms.sendSMS("Your subscription is ending in 2 days", number);
    }
  });
};

export default pulse;
