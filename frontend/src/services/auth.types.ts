import { z } from "zod";

export const emailLoginSchema = z.object({
  email: z.string().min(1, "Enter a valid email address").email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
    ),
});

export const phoneLoginSchema = z.object({
  phone: z.string().length(10, "Phone must have 10 digits"),
});

export type EmailFormValues = z.infer<typeof emailLoginSchema>;
export type PhoneFormValues = z.infer<typeof phoneLoginSchema>;

export interface ErrorResponse {
  error: string;
  success: boolean;
}

export interface AuthResponse {
  token: string;
  role: string;
  email: string;
}
