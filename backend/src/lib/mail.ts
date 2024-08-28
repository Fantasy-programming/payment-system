import logger from "../logger";
import nodemailer from "nodemailer";
import { render } from "@react-email/components";

import Receipt from "../templates/pdf/PDFReceipt";
import { MikronetWelcomeEmail } from "../templates/mikronet-welcome";
import { MikronetSupportEmail } from "../templates/mikronet-support";
import { MikronetResetPassEmail } from "../templates/mikronet-reset-pass";
import { MikronetReceiptEmail } from "../templates/mikronet-receipt";
import { MikronetSubAlertEmail } from "../templates/mikronet-sub-alert";
import { MikronetReminderEmail } from "../templates/mikronet-reminder-user";

import { oauth2Client } from "../constants/mail";
import {
  MAIL_SERVICE,
  MAIL_USERNAME,
  MAIL_CLIENTID,
  MAIL_REFRESH_TOKEN,
  MAIL_CLIENT_SECRET,
} from "../env.ts";

import type { Options } from "nodemailer/lib/smtp-transport/index.js";
import type { IFullTransaction } from "../types/Transaction.type.ts";
import type { IUser } from "../types/User.type.ts";
import { renderToBuffer } from "@react-pdf/renderer";

const createTransporter = async () => {
  oauth2Client.setCredentials({
    refresh_token: MAIL_REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  const SMTPCONFIG: Options = {
    service: MAIL_SERVICE,
    auth: {
      type: "OAUTH2",
      user: MAIL_USERNAME,
      clientId: MAIL_CLIENTID,
      accessToken: accessToken as string,
      clientSecret: MAIL_CLIENT_SECRET,
      refreshToken: MAIL_REFRESH_TOKEN,
    },
  };

  return nodemailer.createTransport(SMTPCONFIG);
};

export async function sendMail(email: string, title: string, body: string) {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: "Mikronet - Reception",
      to: email,
      subject: title,
      html: body,
    });
  } catch (error) {
    logger.error(error);
  }
}

export async function sendMailAttachment(
  email: string,
  title: string,
  body: string,
  content: Buffer,
  filename: string,
) {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: "Mikronet - Reception",
      to: email,
      subject: title,
      html: body,
      attachments: [
        {
          filename,
          content: content,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (error) {
    logger.error(error);
  }
}

export async function sendWelcomeMail(
  email: string,
  firstName: string,
  lastName: string,
  password: string,
) {
  const title = "Welcome to Mikronet";
  const body = render(MikronetWelcomeEmail({ firstName, lastName, password }));
  await sendMail(email, title, body);
  logger.info("Welcome email sent successfully");
}

export async function sendSupportMail(
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  address: string,
  message: string,
  reason: "support" | "transfer",
) {
  const name = `${firstName} ${lastName}`;

  const title =
    reason === "support" ? "Request for support" : "Request for leave";

  const body = render(
    MikronetSupportEmail({ name, phone, email, address, message, reason }),
  );
  await sendMail(email, title, body);

  logger.info(`${reason} requested by user with email ${email}`);
}

export async function sendNewPassEmail(email: string, password: string) {
  const title = "New Password";

  const body = render(MikronetResetPassEmail({ password }));

  await sendMail(email, title, body);
  logger.info("New password email sent successfully");
}

// TODO: Test This
export async function sendReceiptEmail(transaction: IFullTransaction) {
  const title = "Mikronet Receipt";
  const name = `${transaction.user.firstName} ${transaction.user.lastName}`;
  const body = render(MikronetReceiptEmail({ name }));
  const pdf = await renderToBuffer(Receipt({ orderData: transaction }));
  const filename = `receipt-${transaction.trxRef}.pdf`;

  await sendMailAttachment(transaction.user.email, title, body, pdf, filename);
}

export async function sendSubAlertEmail(
  transaction: IFullTransaction,
  email: string,
) {
  const title = "Subscription Alert";
  const body = render(MikronetSubAlertEmail({ transaction }));
  await sendMail(email, title, body);
}

export async function sendSubEndReminderEmail(user: IUser) {
  const title = "Subscription Reminder";
  const body = render(MikronetReminderEmail({ user }));
  await sendMail(user.email, title, body);
}
