import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name is too short"),
  description: z.string().min(10, "Description is too short"),
  status: z.enum(["active", "draft", "archived"]),
  price: z.coerce.number().positive(),
  rate: z.coerce.number().positive(),
  cap: z.coerce.number().positive().optional(),
  capDownTo: z.coerce.number().positive().optional(),
  hasCap: z.boolean(),
  hasPublicIp: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productRequestSchema = productSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .refine((data) => !(data.hasCap && data.cap === undefined), {
    message: "Data Cap is required when hasCap is true",
    path: ["cap"],
  })
  .refine((data) => !(data.hasCap && data.capDownTo === undefined), {
    message: "Cap down to is required when hasCap is true",
    path: ["capDownTo"],
  })
  .refine(
    (data) => {
      if (data.hasCap === false) {
        return data.cap === undefined && data.capDownTo === undefined;
      }

      if (data.cap !== undefined && data.capDownTo !== undefined) {
        return data.cap > data.capDownTo;
      } else {
        return true;
      }
    },
    {
      message: "Data cap should be greater than capDownTo",
      path: ["cap"],
    },
  );

export type Product = z.infer<typeof productSchema>;
export type ProductRequest = z.infer<typeof productRequestSchema>;
