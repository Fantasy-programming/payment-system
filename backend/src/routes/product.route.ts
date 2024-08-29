import { Router } from "express";

import productController from "../controllers/product.controller";
import {
  validateData,
  validateParams,
} from "../middlewares/validation.middleware";
import { idparam, idsSchema } from "../types/api.type";
import { createProductSchema } from "../types/product.type";
import { checkCache } from "../middlewares/cache.middleware";

const productRouter = Router();

// Get all products
productRouter.get("/", checkCache, productController.getAllProducts);

// Get a single product detail
productRouter.get(
  "/:id",
  validateParams(idparam),
  checkCache,
  productController.getProduct,
);

// Create a new product
productRouter.post(
  "/",
  validateData(createProductSchema),
  productController.createProduct,
);

// update a product
productRouter.put(
  "/:id",
  validateParams(idparam),
  validateData(createProductSchema),
  productController.updateProduct,
);

// delete multiple product
productRouter.delete(
  "/",
  validateData(idsSchema),
  productController.deleteProducts,
);

export default productRouter;
