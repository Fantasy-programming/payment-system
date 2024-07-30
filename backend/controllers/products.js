import { Router } from "express";
import { Product } from "../models/Products";

const router = Router();

// Get all products
router.get("/", async (request, response) => {
  const products = await Product.find({ status: { $ne: "deleted" } });
  response.json(products);
});

// Get a single product detail
router.get("/:id", async (request, response) => {
  const product = await Product.findById(request.params.id);
  response.json(product);
});

// Create a new product
router.post("/", async (request, response) => {
  const {
    name,
    description,
    price,
    status,
    rate,
    cap,
    capDownTo,
    hasCap,
    hasPublicIp,
  } = request.body;

  if (
    !name ||
    !description ||
    !price ||
    !rate ||
    !status ||
    hasCap === undefined ||
    hasPublicIp === undefined
  ) {
    return response.status(400).json({ error: "All fields are required" });
  }

  if (hasCap && !cap) {
    return response.status(400).json({ error: "cap is required" });
  }

  if (hasCap && !capDownTo) {
    return response.status(400).json({ error: "capDownTo is required" });
  }

  let product = {
    name,
    description,
    price,
    status,
    rate,
    hasCap,
    hasPublicIp,
  };

  if (hasCap) {
    product = { ...product, cap, capDownTo };
  }

  try {
    const newProduct = new Product(product);
    const savedProduct = await newProduct.save();
    response.json(savedProduct);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

// Delete multiple products (we should change the state to deleted instead)
router.delete("/", async (request, response) => {
  try {
    let { ids } = request.body;

    if (!ids) {
      return response.status(400).json({ error: "missing ids" });
    }

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    await Product.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "deleted" } },
    );
    response.status(204).end();
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: error.message });
  }
});

// Update a single product
router.put("/:id", async (request, response) => {
  const { name, description, status, price, rate, hasCap, hasPublicIp } =
    request.body;
  const { cap, capDownTo } = request.body;

  if (
    !name ||
    !description ||
    !price ||
    !rate ||
    !status ||
    hasCap === undefined ||
    hasPublicIp === undefined
  ) {
    return response.status(400).json({ error: "All fields are required" });
  }

  if (hasCap && !cap) {
    return response.status(400).json({ error: "cap is required" });
  }

  if (hasCap && !capDownTo) {
    return response.status(400).json({ error: "capDownTo is required" });
  }

  let product = {
    name,
    description,
    price,
    status,
    rate,
    hasCap,
    hasPublicIp,
  };

  if (hasCap) {
    product = { ...product, cap, capDownTo };
  } else {
    product = {
      ...product,
      $unset: { cap: "", capDownTo: "" },
    };
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    request.params.id,
    product,
    { new: true, runValidators: true },
  );

  response.json(updatedProduct);
});

export default router;
