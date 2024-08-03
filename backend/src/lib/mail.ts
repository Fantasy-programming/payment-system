import { render } from "@react-email/components";
import { MikronetWelcomeEmail } from "../templates/mikronet-welcome";
import { oauth2Client } from "../constants/mail";
import { type Options } from "nodemailer/lib/smtp-transport/index.js";
import logger from "../logger";
import nodemailer from "nodemailer";

import {
  MAIL_SERVICE,
  MAIL_USERNAME,
  MAIL_CLIENTID,
  MAIL_REFRESH_TOKEN,
  MAIL_CLIENT_SECRET,
} from "../env.ts";

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
