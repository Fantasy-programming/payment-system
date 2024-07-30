import axios from "axios";

const EXPIRY = 5; // in minutes
const LENGTH = 6; // OTP length
const MEDIUM = "sms"; // OTP medium
const SENDER_ID = "Mikronet"; // Sender ID
const TYPE = "numeric"; // OTP type

const OTP_ENDPOINT = "https://sms.arkesel.com/api/otp/generate";
const OTP_VERIFY_ENDPOINT = "https://sms.arkesel.com/api/otp/verify";

const sendOTP = async ({ message, number }) => {
  const headers = {
    "Content-Type": "application/json",
    "api-key": process.env.ARKESEL_API_KEY,
  };

  const body = {
    expiry: EXPIRY,
    length: LENGTH,
    message,
    medium: MEDIUM,
    number,
    sender_id: SENDER_ID,
    type: TYPE,
  };

  try {
    const response = await axios.post(OTP_ENDPOINT, body, { headers });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error sending OTP:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

const verifyOTP = async ({ code, number }) => {
  const headers = {
    "Content-Type": "application/json",
    "api-key": process.env.ARKESEL_API_KEY,
  };

  const body = {
    code,
    number,
  };

  try {
    const response = await axios.post(OTP_VERIFY_ENDPOINT, body, { headers });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error verifying OTP:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export default { sendOTP, verifyOTP };
