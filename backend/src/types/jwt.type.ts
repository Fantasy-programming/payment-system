import { z } from "zod";
import { createObjectId } from "./Api.type";

export const jwtTokenSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
  id: createObjectId("invalid ID"),
});

export type IJWT = z.infer<typeof jwtTokenSchema>;
