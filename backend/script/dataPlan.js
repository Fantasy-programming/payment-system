const Product = require("../models/Products");

const data = [
  {
    name: "₵310",
    description: "our starter plan",
    price: 310,
    rate: "12",
    cap: "30",
    capDownTo: "2",
    hasCap: true,
    hasPublicIp: false,
  },
  {
    name: "₵450",
    description: "our standard plan",
    price: 450,
    rate: 16,
    cap: 50,
    capDownTo: 4,
    hasCap: true,
    hasPublicIp: false,
  },
  {
    name: "₵600",
    description: "For small businesses",
    price: 600,
    rate: 20,
    cap: 80,
    capDownTo: 10,
    hasCap: true,
    hasPublicIp: false,
  },
];

async function createProducts() {
  await Promise.all(
    data.map(async (item) => {
      const product = new Product(item);
      await product.save();
    }),
  );

  console.log("Products created successfully");
}

module.exports = createProducts;
