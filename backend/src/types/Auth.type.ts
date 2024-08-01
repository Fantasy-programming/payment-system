import { z } from "zod";
import { PASSREGEX } from "../constants/regex";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email or password"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      PASSREGEX,
      "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
    ),
});

export const otpSchema = z.object({
  value: z
    .string({
      required_error: "invalid request, value, token and type are required",
    })
    .min(1, "Enter a valid value"),
  token: z
    .string({
      required_error: "invalid request, value, token and type are required",
    })
    .length(6, "OTP token should be 6 digits long"),
  type: z.enum(["email", "phone"], {
    required_error: "invalid request, value, token and type are required",
  }),
});

export const phoneSchema = z.object({
  phone: z.string().length(10, "Phone must have 10 digits"),
});

export type LOGINREQ = z.infer<typeof loginSchema>;
export type OTPREQ = z.infer<typeof otpSchema>;
export type PHONEREQ = z.infer<typeof phoneSchema>;
