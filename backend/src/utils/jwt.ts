import jwt from "jsonwebtoken";

import type { ObjectId } from "mongoose";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../env";

export const generateAccessToken = (
  email: string,
  role: string,
  id: ObjectId,
) => {
  return jwt.sign({ email, role, id }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = (email: string) => {
  return jwt.sign({ email }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
