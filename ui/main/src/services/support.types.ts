import { z } from "zod";

export const supportSchema = z.object({
  message: z.string().min(10, "Please describe what went wrong"),
});

export type SupportRequest = z.infer<typeof supportSchema>;

export const transferSchema = z.object({
  newAddress: z.string().min(5, "New address is required"),
});

export type TransferRequest = z.infer<typeof transferSchema>;
