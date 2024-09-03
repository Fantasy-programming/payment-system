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

export const AdminPrefAlertSchema = z.object({
  id: z.string(),
  userId: z.string(),
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
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export type UserAlertingSettings = z.infer<typeof userPrefAlertSchema>;
export type AdminAlertingSettings = z.infer<typeof AdminPrefAlertSchema>;
export type UserAlertingRequest = z.infer<typeof userAlertingRequestSchema>;
export type AdminAlertingRequest = z.infer<typeof adminAlertingRequestSchema>;
