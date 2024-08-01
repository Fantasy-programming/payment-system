import authService from "../services/authService";

import type { Request, Response } from "express";
import type { LOGINREQ, OTPREQ } from "../types/Auth.type";

const verifyOTP = async (request: Request, response: Response) => {
  const { value, token } = request.body as OTPREQ;
  const data = await authService.verifyOTP(value, token);
  return response.status(200).json(data);
};

const login = async (request: Request, response: Response) => {
  const { email, password } = request.body as LOGINREQ;
  const data = await authService.emailLogin(email, password);
  return response.status(200).json(data);
};

const mobileLogin = async (request: Request, response: Response) => {
  const { phone } = request.body;
  await authService.mobileLogin(phone);
  return response.status(200).json({ message: "OTP sent to phone number" });
};

export default { login, mobileLogin, verifyOTP };
