import productService from "../services/productService";
import { invalidateCache } from "../middlewares/cache";

import type { Request, Response } from "express";
import type { ICreateProduct } from "../types/Product.type";
import type { IdParam, Ids } from "../types/Api.type";

const getAllProducts = async (_request: Request, response: Response) => {
  const products = await productService.getAll();
  response.json(products);
};

const getProduct = async (request: Request, response: Response) => {
  const { id } = request.params as unknown as IdParam;
  const product = await productService.getOne(id);

  response.json(product);
};

const createProduct = async (request: Request, response: Response) => {
  const body = request.body as ICreateProduct;
  const data = productService.create(body);
  const redis = request.app.locals.cache;

  await invalidateCache(redis, "products");

  response.json(data);
};

const deleteProducts = async (request: Request, response: Response) => {
  const { ids } = request.body as Ids;
  const redis = request.app.locals.cache;
  await productService.remove(ids);
  await invalidateCache(redis, "products");
  response.status(204).end();
};

const updateProduct = async (request: Request, response: Response) => {
  const { id } = request.params as unknown as IdParam;
  const body = request.body as ICreateProduct;
  const redis = request.app.locals.cache;

  const data = await productService.updateOne(id, body);
  await invalidateCache(redis, "products");
  response.json(data);
};

export default {
  getAllProducts,
  getProduct,
  createProduct,
  deleteProducts,
  updateProduct,
};
