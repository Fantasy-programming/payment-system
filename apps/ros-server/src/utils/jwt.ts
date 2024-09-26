import jwt from "jsonwebtoken";

import type { ObjectId } from "mongoose";
import env from "../env";

/**
 * Generates an access token for a user.
 * The token includes the user's email, role, and id, and expires in 1 hour.
 *
 * @param email - The email of the user.
 * @param role - The role of the user.
 * @param id - The id of the user.
 * @returns The generated access token.
 */

export const generateAccessToken = (
  email: string,
  role: string,
  id: ObjectId,
) => {
  return jwt.sign({ email, role, id }, env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

/**
 * Generates a refresh token for a user.
 * The token includes the user's email and expires in 7 days.
 *
 * @param email - The email of the user.
 * @returns The generated refresh token.
 */

export const generateRefreshToken = (email: string) => {
  return jwt.sign({ email }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
