import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, "Enter a valid first name"),
  lastName: z.string().min(1, "Enter a valid last name"),
  email: z.string().min(1, "Enter a valid email address").email(),
  phone: z.string().length(10, "Phone must have 10 digits"),
  zone: z.string({
    required_error: "Select a zone",
  }),
  status: z.enum(["active", "inactive"]),
  address: z.string().min(1, "Enter a valid address"),
  routerID: z.string().min(1, "Enter a valid router ID"),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userUpdateSchema = userSchema.omit({
  id: true,
});

export const userPersonalUpdateSchema = userUpdateSchema
  .pick({
    phone: true,
    email: true,
  })
  .extend({
    phone: z.string().length(10, "Phone must have 10 digits").optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
      )
      .optional(),
  });

export const newUserSchema = userUpdateSchema
  .omit({
    status: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: true,
    updatedAt: true,
    role: true,
  })
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/,
        "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
      ),
  });

export type User = z.infer<typeof userSchema>;
export type NewUser = z.infer<typeof newUserSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type UserPersonalUpdate = z.infer<typeof userPersonalUpdateSchema>;
