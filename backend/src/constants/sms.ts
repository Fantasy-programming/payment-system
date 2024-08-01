import { ARKESEL_API_KEY } from "../env";

const EXPIRY = 5; // in minutes
const LENGTH = 6; // OTP length
const MEDIUM = "sms"; // OTP medium
const SENDER_ID = "Mikronet"; // Sender ID
const TYPE = "numeric"; // OTP type

const OTP_ENDPOINT = "https://sms.arkesel.com/api/otp/generate";
const OTP_VERIFY_ENDPOINT = "https://sms.arkesel.com/api/otp/verify";
const OTP_MESSAGE =
  "Your otp is %otp_code%. It will expire in %expiry% minutes.";

const HEADER = {
  "Content-Type": "application/json",
  "api-key": ARKESEL_API_KEY,
};

const OTPBODYBASE = {
  expiry: EXPIRY,
  length: LENGTH,
  medium: MEDIUM,
  sender_id: SENDER_ID,
  type: TYPE,
};

export default {
  HEADER,
  OTPBODYBASE,
  EXPIRY,
  LENGTH,
  MEDIUM,
  SENDER_ID,
  TYPE,
  OTP_ENDPOINT,
  OTP_VERIFY_ENDPOINT,
  OTP_MESSAGE,
};
