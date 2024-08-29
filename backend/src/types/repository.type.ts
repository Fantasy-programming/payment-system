import { z } from "zod";

export const ArkseselVerifySchema = z.object({
  message: z.string(),
  code: z.string(),
});

export type IArkeselVerify = z.infer<typeof ArkseselVerifySchema>;
