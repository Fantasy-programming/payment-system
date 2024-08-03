import { z } from "zod";

export const userPrefAlertSchema = z.object({
  id: z.string(),
  userId: z.string(),
  emailAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  subscriptionAlert: z.boolean(),
  productAlert: z.boolean(),
  receiptEmail: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userAlertingRequestSchema = userPrefAlertSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export type UserAlertingSettings = z.infer<typeof userPrefAlertSchema>;
export type UserAlertingRequest = z.infer<typeof userAlertingRequestSchema>;
