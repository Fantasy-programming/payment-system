import axios from "axios";
import sms from "../constants/sms";
import logger from "../logger";

import { InternalError } from "../utils/errors.ts";

/**
 * Asynchronously sends an OTP message to a specified number.
 *
 * @param {string} message - The OTP message to be sent.
 * @param {string} number - The recipient's phone number.
 * @returns A promise that resolves with the response data from the OTP service.
 * @throws {Error} If there is an error sending the OTP.
 */

const sendOTP = async (message: string, number: string) => {
  const base = sms.OTPBODYBASE;
  const body = { ...base, number, message };

  try {
    const response = await axios.post(sms.OTP_ENDPOINT, body, {
      headers: sms.HEADER,
    });

    return response.data;
  } catch (error) {
    logger.error("Error sending OTP:", error);
    throw InternalError;
  }
};

/**
 * Asynchronously sends an SMS message to a specified number.
 *
 * @param {string} message - The message to be sent.
 * @param {string} number - The recipient's phone number.
 * @returns A promise that resolves with the response data from the SMS service.
 * @throws {InternalError} If there is an error sending the SMS.
 */

const sendSMS = async (message: string, number: string) => {
  const body = { message, recipients: [number], sender: sms.SENDER_ID };

  try {
    const response = await axios.post(sms.SMS_ENDPOINT, body, {
      headers: sms.HEADER,
    });
    return response.data;
  } catch (error) {
    logger.error("Error sending SMS:", error);
    throw InternalError;
  }
};

/**
 * Asynchronously verifies an OTP code for a specified number.
 *
 * @param {string} code - The OTP code to be verified.
 * @param {string} number - The phone number to verify the OTP code for.
 * @returns A promise that resolves with the response data from the OTP service.
 * @throws {InternalError} If there is an error verifying the OTP.
 */

const verifyOTP = async (code: string, number: string) => {
  const body = { code, number };

  try {
    const response = await axios.post(sms.OTP_VERIFY_ENDPOINT, body, {
      headers: sms.HEADER,
    });

    return response.data;
  } catch (error) {
    logger.error("Error verifying OTP:", error);
    throw InternalError;
  }
};

export default { sendOTP, verifyOTP, sendSMS };
