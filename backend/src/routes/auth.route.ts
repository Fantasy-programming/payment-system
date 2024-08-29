import { Router } from "express";

import authController from "../controllers/auth.controller";
import { validateData } from "../middlewares/validation.middleware";
import { loginSchema, otpSchema, phoneSchema } from "../types/auth.type";

const authRouter = Router();

authRouter.post("/verify", validateData(otpSchema), authController.verifyOTP);
authRouter.post("/login", validateData(loginSchema), authController.login);
authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/logout", authController.logout);
authRouter.post(
  "/mobile",
  validateData(phoneSchema),
  authController.mobileLogin,
);

export default authRouter;
