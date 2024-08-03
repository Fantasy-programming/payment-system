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

export const userAlertingRequestSchema = userPrefAlertSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export type UserAlertingSettings = z.infer<typeof userPrefAlertSchema>;
export type UserAlertingRequest = z.infer<typeof userAlertingRequestSchema>;
export type UserAlertingModel = Model<UserAlertingSettings>;
