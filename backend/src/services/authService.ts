import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import arkesel from "../lib/sms";
import sms from "../constants/sms";

import { User } from "../models/User";
import { JWT_SECRET } from "../env";
import { CommonError } from "../utils/errors";

const emailLogin = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new CommonError("Invalid email or password");
  }

  const goodpass = await bcrypt.compare(password, user.password);

  if (!goodpass) {
    throw new CommonError("Invalid email or password");
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

const mobileLogin = async (phone: string) => {
  const user = await User.findOne({ phone });

  if (!user) {
    throw new CommonError("No user with this phone number");
  }

  await arkesel.sendOTP(sms.OTP_MESSAGE, phone);
};

const verifyOTP = async (value: string, code: string) => {
  const res = await arkesel.verifyOTP(code, value);

  if (res.code !== "1100") {
    throw new CommonError("OTP invalid or has expired");
  }

  const user = await User.findOne({ phone: value });

  if (!user) {
    throw new CommonError("No user with this phone number");
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

export default { emailLogin, mobileLogin, verifyOTP };
