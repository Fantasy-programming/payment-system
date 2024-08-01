import { z } from "zod";
import { Model, type ObjectId } from "mongoose";

export const productSchema = z.object({
  id: z.custom<ObjectId>(),
  name: z.string().min(3, "Name is too short"),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(10, "Description is too short"),
  status: z.enum(["active", "draft", "archived", "deleted"], {
    required_error: "Status is required",
  }),
  price: z
    .number({
      required_error: "Price is required",
    })
    .positive(),
  rate: z
    .number({
      required_error: "Rate is required",
    })
    .positive(),
  cap: z.number().positive().optional(),
  capDownTo: z.number().positive().optional(),
  hasCap: z.boolean({
    required_error: "hasCap is required",
  }),
  hasPublicIp: z.boolean({
    required_error: "hasPublicIp is required",
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createProductSchema = productSchema
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

export type IProduct = z.infer<typeof productSchema>;
export type ICreateProduct = z.infer<typeof createProductSchema>;
export type ProductModel = Model<IProduct>;
