import { Router } from "express";

import productController from "../controllers/productController";
import { validateData, validateParams } from "../middlewares/validation";
import { idparam, idsSchema } from "../types/Api.type";
import { createProductSchema } from "../types/Product.type";
import { checkCache } from "../middlewares/cache";

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
