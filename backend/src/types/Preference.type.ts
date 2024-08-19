import { z } from "zod";
import { Model } from "mongoose";
import { createObjectId } from "./Api.type";

export const userPrefAlertSchema = z.object({
  id: createObjectId("invalid ID"),
  userId: createObjectId("invalid user ID"),
  emailAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  subscriptionAlert: z.boolean(),
  productAlert: z.boolean(),
  receiptEmail: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const AdminPrefAlertSchema = z.object({
  userId: createObjectId("invalid user ID"),
  emailAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  leaveAlertEmail: z.string().email(),
  problemAlertEmail: z.string().email(),
  activationAlertEmail: z.string().email(),
  leaveAlertPhone: z.string().length(10),
  problemAlertPhone: z.string().length(10),
  activationAlertPhone: z.string().length(10),
  leaveAlert: z.boolean(),
  problemAlert: z.boolean(),
  activationAlert: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const userAlertingRequestSchema = userPrefAlertSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export const adminAlertingRequestSchema = AdminPrefAlertSchema.omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export type UserAlertingSettings = z.infer<typeof userPrefAlertSchema>;
export type AdminAlertingSettings = z.infer<typeof AdminPrefAlertSchema>;

export type UserAlertingRequest = z.infer<typeof userAlertingRequestSchema>;
export type AdminAlertingRequest = z.infer<typeof adminAlertingRequestSchema>;

export type UserAlertingModel = Model<UserAlertingSettings>;
export type AdminAlertingModel = Model<AdminAlertingSettings>;
