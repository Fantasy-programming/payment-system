import { type IUser } from "./User.type";

declare global {
  namespace Express {
    interface Request {
      token?: string;
      user?: IUser;
    }
  }
}

// Ensure this file is treated as a module
export {};
