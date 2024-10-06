import { z } from "zod";

export const supportReqSchema = z.object({
  message: z.string().min(10, "Please describe what went wrong"),
});

export type SupportRequest = z.infer<typeof supportReqSchema>;

export const transferReqSchema = z.object({
  newAddress: z.string().min(5, "New address is required"),
});

export type TransferRequest = z.infer<typeof transferReqSchema>;
