require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_ATLAS_URI
    : process.env.MONGODB_LOCAL_URI;

const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER_ID = process.env.SMS_DEVICE_ID;

module.exports = {
  MONGODB_URI,
  PORT,
  SMS_SENDER_ID,
  SMS_API_KEY,
};
