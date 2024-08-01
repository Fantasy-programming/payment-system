import type { ObjectId } from "mongoose";
import { Product } from "../models/Products";
import type { ICreateProduct } from "../types/Product.type";

const getAll = async () => {
  const products = await Product.find({ status: { $ne: "deleted" } });
  return products;
};

const getOne = async (id: ObjectId) => {
  const product = await Product.findById(id);
  return product;
};

const create = async (product: ICreateProduct) => {
  const newProduct = new Product(product);
  const savedProduct = await newProduct.save();
  return savedProduct;
};

const remove = async (ids: ObjectId[] | ObjectId) => {
  let id = ids;

  if (!Array.isArray(ids)) {
    id = [ids];
  }

  await Product.updateMany(
    { _id: { $in: id } },
    { $set: { status: "deleted" } },
  );
};

const updateOne = async (id: ObjectId, product: ICreateProduct) => {
  const updateFields = product.hasCap
    ? { cap: product.cap, capDownTo: product.capDownTo }
    : { $unset: { cap: "", capDownTo: "" } };

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    product.hasCap
      ? { ...product, $set: updateFields }
      : { ...product, ...updateFields },
    { new: true, runValidators: true },
  );

  return updatedProduct;
};

export default { getAll, getOne, remove, create, updateOne };
