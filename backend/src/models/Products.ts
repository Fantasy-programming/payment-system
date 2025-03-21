import { Schema, model } from "mongoose";
import type { IProduct, ProductModel } from "../types/Product.type";

const productSchema = new Schema<IProduct, ProductModel>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: {
    type: String,
    enum: ["active", "draft", "archived", "deleted"],
    default: "active",
    required: true,
  },
  price: { type: Number, required: true },
  rate: { type: Number, required: true },
  cap: { type: Number, required: false },
  capDownTo: { type: Number, required: false },
  hasCap: { type: Boolean, required: true },
  hasPublicIp: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

productSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const Product: ProductModel = model<IProduct, ProductModel>(
  "Product",
  productSchema,
);
