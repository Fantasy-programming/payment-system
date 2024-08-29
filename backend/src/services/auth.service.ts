import jwt from "jsonwebtoken";
import arkesel from "../lib/sms.lib";
import sms from "../constants/sms.const";

import { User } from "../models/user.model";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../env";
import { UnauthorizedError } from "../utils/errors";
import type { ObjectId } from "mongoose";

const generateAccessToken = (email: string, role: string, id: ObjectId) => {
  return jwt.sign({ email, role, id }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (email: string) => {
  return jwt.sign({ email }, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

const emailLogin = async (email: string, password: string) => {
  const user = await User.findOne({ email, status: "active" });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const goodpass = await Bun.password.verify(password, user.password);

  if (!goodpass) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = generateAccessToken(user.email, user.role, user._id);

  return { token, role: user.role, email: user.email };
};

const mobileLogin = async (phone: string) => {
  const user = await User.findOne({ phone, status: "active" });

  if (!user) {
    throw new UnauthorizedError("No user with this phone number");
  }

  await arkesel.sendOTP(sms.OTP_MESSAGE, phone);
};

const verifyOTP = async (value: string, code: string) => {
  const res = await arkesel.verifyOTP(code, value);

  if (res.code !== "1100") {
    throw new UnauthorizedError("OTP invalid or has expired");
  }

  const user = await User.findOne({ phone: value, status: "active" });

  if (!user) {
    throw new UnauthorizedError("No user with this phone number");
  }

  const userForToken = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  // Token expires in 1 hour 60s x 60s
  const token = jwt.sign(userForToken, JWT_SECRET, {
    expiresIn: 60 * 60,
  });

  return { token, role: user.role, email: user.email };
};

const refreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { email: string };
    const user = await User.findOne({ email: decoded.email, status: "active" });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const newToken = generateAccessToken(user.email, user.role, user._id);

    return { token: newToken, role: user.role, email: user.email };
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};

export default {
  emailLogin,
  mobileLogin,
  verifyOTP,
  generateRefreshToken,
  refreshToken,
};
