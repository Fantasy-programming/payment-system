import { z } from "zod";
import { type ObjectId } from "mongoose";

export const jwtTokenSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
  id: z.custom<ObjectId>(),
});

export type IJWT = z.infer<typeof jwtTokenSchema>;
