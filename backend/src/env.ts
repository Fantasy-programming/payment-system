import "dotenv/config";

// SMS
export const ARKESEL_API_KEY = process.env.ARKESEL_API_KEY;

// Server
export const NODE_ENV = process.env.NODE_ENV || false;
export const PORT = process.env.PORT;
export const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_ATLAS_URI
    : process.env.MONGODB_LOCAL_URI;
export const JWT_SECRET = process.env.SECRET || "";
export const JWT_REFRESH_SECRET = process.env.REFRESH_SECRET || "";

// Payment
export const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Mail
export const MAIL_SERVICE = process.env.MAIL_SERVICE;
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_CLIENTID = process.env.MAIL_CLIENTID;
export const MAIL_CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET;
export const MAIL_REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN;
