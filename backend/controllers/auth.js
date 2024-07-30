import jwt from "jsonwebtoken";
import logger from "../lib/logger";
import sms from "../lib/sms";

import { Router } from "express";
import { User } from "../models/User";

const router = Router();

// Verify OTP When using phone
router.post("/verify-otp", async (request, response) => {
  const { value, token, type } = request.body;

  if (!value || !token || !type) {
    return response.status(400).json({
      error: "invalid request, value, token and type are required",
    });
  }

  try {
    const res = await sms.verifyOTP({ code: token, number: value });

    if (res.code !== "1100") {
      return response
        .status(400)
        .json({ error: "OTP invalid or has expired", success: false });
    }

    const user = await User.findOne({ phone: value });

    const userForToken = {
      email: user.email,
      role: user.role,
      id: user._id,
    };

    const jwtToken = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    const payload = {
      email: user.email,
      role: user.role,
      token: jwtToken,
    };

    return response.status(200).send(payload);
  } catch (error) {
    logger.error(error);
    return response.status(400).json({ error: "OTP invalid or has expired" });
  }
});

// login user
router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({
      error: "invalid request, email and password are required",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return response.status(401).json({
      error: "invalid email or password",
    });
  }

  // const passwordCorrect =
  //   user === null ? false : await bcrypt.compare(password, user?.password);
  //
  // if (!(user && passwordCorrect)) {
  //   return response.status(401).json({
  //     error: "invalid email or password",
  //   });
  // }

  const userForToken = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  // Token expires in 1 hour 60s x 60s
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  response.status(200).send({ token, role: user.role, email: user.email });
});

router.post("/mobile", async (request, response) => {
  const { phone } = request.body;

  if (!phone) {
    return response
      .status(400)
      .json({ success: true, error: "invalid request, missing phone number" });
  }

  const user = await User.findOne({ phone });

  if (!user) {
    return response.status(400).json({
      success: false,
      error: "No user with this phone number",
    });
  }

  try {
    const res = await sms.sendOTP({
      message: "Your otp is %otp_code%. It will expire in %expiry% minutes.",
      number: phone,
    });

    logger.info(res);

    response
      .status(200)
      .json({ success: true, message: "Otp sent to phone number" });
  } catch (e) {
    console.log(e);
    response
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

export default router;
