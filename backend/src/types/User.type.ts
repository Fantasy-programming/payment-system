import { z } from "zod";
import { Model, type ObjectId } from "mongoose";

export const userSchema = z.object({
  id: z.custom<ObjectId>(),
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
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const updateUserSchema = userSchema.omit({
  id: true,
  password: true,
});

export const createUserSchema = userSchema.omit({
  id: true,
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
export type UserModel = Model<IUser>;
