import axios from "axios";
import sms from "../constants/sms";
import logger from "../logger";

import { InternalError } from "../utils/errors.ts";

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

export default { sendOTP, verifyOTP };
