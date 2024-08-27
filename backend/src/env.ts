// SMS
export const ARKESEL_API_KEY = Bun.env.ARKESEL_API_KEY || "";

// Server
export const NODE_ENV = Bun.env.NODE_ENV;
export const PORT = Bun.env.PORT;
export const MONGODB_URI = Bun.env.MONGODB_URI;
export const JWT_SECRET = Bun.env.SECRET || "";
export const JWT_REFRESH_SECRET = Bun.env.REFRESH_SECRET || "";

// Payment
export const PAYSTACK_SECRET_KEY = Bun.env.PAYSTACK_SECRET_KEY;

// Mail
export const MAIL_SERVICE = Bun.env.MAIL_SERVICE;
export const MAIL_USERNAME = Bun.env.MAIL_USERNAME;
export const MAIL_PASSWORD = Bun.env.MAIL_PASSWORD;
export const MAIL_CLIENTID = Bun.env.MAIL_CLIENTID;
export const MAIL_CLIENT_SECRET = Bun.env.MAIL_CLIENT_SECRET;
export const MAIL_REFRESH_TOKEN = Bun.env.MAIL_REFRESH_TOKEN;
