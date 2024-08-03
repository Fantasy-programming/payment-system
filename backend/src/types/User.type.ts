import { z } from "zod";
import { Model } from "mongoose";
import { createObjectId } from "./Api.type";

export const userSchema = z.object({
  _id: createObjectId("invalid ID"),
  id: createObjectId("invalid ID"),
  firstName: z.string().min(1, "Enter a valid first name"),
  lastName: z.string().min(1, "Enter a valid last name"),
  email: z.string().min(1, "Enter a valid email address").email(),
  password: z.string(),
  phone: z.string().length(10, "Phone must have 10 digits"),
  zone: z
    .string({
      required_error: "Select a zone",
    })
    .min(1, "Select a zone"),
  routerID: z.string().min(1, "Enter a valid router ID"),
  address: z.string().min(1, "Enter a valid address"),
  emailVerified: z.boolean(),
  phoneVerified: z.boolean(),
  status: z.enum(["active", "inactive"]),
  role: z.enum(["user", "admin"]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const userPersonalUpdateSchema = userSchema
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

export const updateUserSchema = userSchema.omit({
  _id: true,
  password: true,
});

export const createUserSchema = userSchema.omit({
  _id: true,
  emailVerified: true,
  phoneVerified: true,
  status: true,
  role: true,
  createdAt: true,
  updatedAt: true,
});

export type IUser = z.infer<typeof userSchema>;
export type IUserCreate = z.infer<typeof createUserSchema>;
export type IUserUpdate = z.infer<typeof updateUserSchema>;
export type IUserPersonalUpdate = z.infer<typeof userPersonalUpdateSchema>;
export type UserModel = Model<IUser>;
