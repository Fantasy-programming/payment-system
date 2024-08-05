import authService from "../services/authService";

import type { Request, Response } from "express";
import type { LOGINREQ, OTPREQ } from "../types/Auth.type";
import { NODE_ENV } from "../env";

const login = async (request: Request, response: Response) => {
  const { email, password } = request.body as LOGINREQ;
  const data = await authService.emailLogin(email, password);
  const refreshToken = authService.generateRefreshToken(data.email);

  response.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return response.status(200).json(data);
};

const mobileLogin = async (request: Request, response: Response) => {
  const { phone } = request.body;
  await authService.mobileLogin(phone);
  return response.status(200).json({ message: "OTP sent to phone number" });
};

const logout = async (_request: Request, response: Response) => {
  response.clearCookie("refreshToken");
  return response.status(200).json({ message: "Logged out" });
};

const verifyOTP = async (request: Request, response: Response) => {
  const { value, token } = request.body as OTPREQ;
  const data = await authService.verifyOTP(value, token);
  return response.status(200).json(data);
};

const refreshToken = async (request: Request, response: Response) => {
  const token: string = request.cookies.refreshToken;

  if (!token) {
    return response.status(400).json({ error: "refresh token missing" });
  }

  const data = await authService.refreshToken(token);

  return response.status(200).json(data);
};

export default { login, mobileLogin, verifyOTP, refreshToken, logout };
