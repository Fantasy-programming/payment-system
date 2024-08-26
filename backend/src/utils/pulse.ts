import { Pulse } from "@pulsecron/pulse";

import { sendMail } from "../lib/mail";
import sms from "../lib/sms";
import logger from "../logger";

import type { DB } from "./mongo";
import type { IUser } from "../types/User.type";
import type { IProduct } from "../types/Product.type";
import type { ITransaction } from "../types/Transaction.type";

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

export class Scheduler {
  public pulse: Pulse;
  private db: DB;

  constructor(db: DB) {
    this.pulse = new Pulse();
    this.db = db;
  }

  /**
   * Initializes the Pulse monitoring tool.
   * It sets up a connection to the MongoDB database, configures Pulse to monitor the "jobs" collection,
   * sets up job handlers, and starts Pulse.
   *
   * @throws Will throw an error if the MongoDB connection cannot be established.
   */

  async init() {
    const connection = this.db.getCon();

    if (!connection) {
      logger.error("Error seting up Scheduler, missing db connectino string");
      process.exit(1);
    }

    // @ts-expect-error - Mongodb types are mismatched
    this.pulse.mongo(connection, "jobs");
    logger.info("🟢 Setting up Pulse...");
    this.setupJobs();
    await this.pulse.start();
    logger.info("🟢 Pulse started");
  }

  async close() {
    await this.pulse.stop();
    logger.info("🔴 Pulse stopped");
  }

  /**
   * Sets up Pulse jobs.
   */

  setupJobs() {
    // Send Subscription Reminder
    this.pulse.define<SubReminderJob>(
      "send subscription reminder",
      async (job) => {
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
      },
    );

    //TODO: Render the email with the transaction detail

    // Send Receipt + attachment to Email
    this.pulse.define<ReceiptJob>("send receipt email", async (job) => {
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
    this.pulse.define<AdminAlertJob>("subscription Alert", async (job) => {
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
  }
}
