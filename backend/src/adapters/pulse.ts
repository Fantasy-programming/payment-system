import { Pulse } from "@pulsecron/pulse";

import {
  sendReceiptEmail,
  sendSubAlertEmail,
  sendSubEndReminderEmail,
} from "../lib/mail";
import { adminPreferences } from "../utils/preferences";

import sms from "../lib/sms";
import logger from "../logger";

import type { DB } from "./mongo";
import type { IUser } from "../types/User.type";
import type { IFullTransaction } from "../types/Transaction.type";
import { InternalError } from "../utils/errors";

interface ReceiptJob {
  transactionDetail: IFullTransaction;
}

interface SubEndReminderJob {
  userDetail: IUser;
  alertType: string;
}

interface SubAlertJob {
  transactionDetail: IFullTransaction;
  alertType: string;
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
    this.setupHooks();
    await this.pulse.start();
    logger.info("🟢 Pulse started");
  }

  async close() {
    await this.pulse.stop();
    logger.info("🔴 Pulse stopped");
  }

  setupHooks() {
    this.pulse.on("success", (job) => {
      logger.info(`🟢 Job ${job.attrs.name} completed successfully`);
    });

    this.pulse.on("fail", (error, job) => {
      logger.error(`🔴 Job <${job.attrs.name}> failed`, error);
    });
  }

  /**
   * Sets up Pulse jobs.
   */

  setupJobs() {
    //NOTE: We may want to fetch the maybe updated user prefs
    this.pulse.define<SubEndReminderJob>(
      "send subscription reminder",
      async (job) => {
        const { userDetail, alertType } = job.attrs.data;

        if (alertType === "email") {
          await sendSubEndReminderEmail(userDetail);
        } else if (alertType === "sms") {
          await sms.sendSMS(
            "Your subscription is ending in 2 days, login to renew and avoid service disruption",
            userDetail.phone,
          );
        }
      },
    );

    // Send Receipt + attachment to Email
    this.pulse.define<ReceiptJob>("send receipt email", async (job) => {
      const { transactionDetail } = job.attrs.data;
      await sendReceiptEmail(transactionDetail);
    });

    // Send Subscription Alert to the admin
    this.pulse.define<SubAlertJob>("subscription Alert", async (job) => {
      const { transactionDetail, alertType } = job.attrs.data;

      const email = adminPreferences?.activationAlertEmail;
      const phone = adminPreferences?.activationAlertPhone;

      // if the alert type is of a type but the needed medium is missing throw an error

      if (alertType === "email" && !email) {
        throw new InternalError("Email is missing");
      } else if (alertType === "sms" && !phone) {
        throw new InternalError("SMS number is missing");
      }

      if (alertType === "email" && email) {
        sendSubAlertEmail(transactionDetail, email);
      } else if (alertType === "sms" && phone) {
        await sms.sendSMS(
          `The user ${transactionDetail.user.firstName} ${transactionDetail.user.lastName} has purchased a subscription package, see bellow the details\nPlan: ${transactionDetail.product.name}\nDuration: ${transactionDetail.duration}\nRouterID:${transactionDetail.user.routerID}\nZone: ${transactionDetail.user.zone}\nstartDate: ${transactionDetail.startDate.toString()}\nendDate: ${transactionDetail.endDate.toString()} `,
          phone,
        );
      }
    });
  }
}
