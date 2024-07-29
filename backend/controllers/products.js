const router = require("express").Router();
// const userExtractor = require("../lib/middleware").userExtractor;

const Product = require("../models/Products");

// Get all products
router.get("/", async (request, response) => {
  const products = await Product.find({});
  response.json(products);
});

// Get a single product detail
router.get("/:id", async (request, response) => {
  const product = await Product.findById(request.params.id);
  response.json(product);
});

// Create a new product

// Delete multiple products

// Delete a single products

// Update a single product

module.exports = router;
