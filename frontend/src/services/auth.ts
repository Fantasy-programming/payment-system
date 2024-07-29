import axios from "@/lib/axios";

import { SignupFormValues } from "@/routes/auth/signup";
import { EmailFormValues, PhoneFormValues } from "@/routes/auth/login";
import { AuthResponse } from "./auth.types";

const BASEURI = "/auth";

const login = async (credentials: EmailFormValues) => {
  const response = await axios.post<AuthResponse>(
    `${BASEURI}/login`,
    credentials,
  );
  return response.data;
};

const mobileLogin = async (credentials: PhoneFormValues) => {
  const response = await axios.post(`${BASEURI}/mobile`, credentials);
  return response.data;
};

const signup = async (data: SignupFormValues) => {
  const response = await axios.post(`${BASEURI}/signup`, data);
  return response.data;
};

const verify = async (
  token: string,
  type: "email" | "phone",
  value: string,
) => {
  const response = await axios.post<AuthResponse>(`${BASEURI}/verify-otp`, {
    token,
    type,
    value,
  });
  return response.data;
};

export default { login, signup, verify, mobileLogin };
