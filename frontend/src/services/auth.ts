import { api as axios } from "@/lib/axios";

import { AuthResponse, EmailFormValues, PhoneFormValues } from "./auth.types";

const BASEURI = "/auth";

const emaillogin = async (credentials: EmailFormValues) => {
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

const logout = async () => {
  await axios.post(`${BASEURI}/logout`);
};

const verify = async (
  token: string,
  type: "email" | "phone",
  value: string,
) => {
  const response = await axios.post<AuthResponse>(`${BASEURI}/verify`, {
    token,
    type,
    value,
  });
  return response.data;
};

export default { emaillogin, verify, mobileLogin, logout };
