const router = require("express").Router();
const userExtractor = require("../lib/middleware").userExtractor;

const Transaction = require("../models/Transaction");
const paystack = require("../lib/paystack");

// Get all transactions
router.get("/", userExtractor, async (request, response) => {
  if (request.user.role === "admin") {
    const transactions = await Transaction.find({})
      .populate("user")
      .populate("product")
      .sort({ createdAt: -1 });
    return response.json(transactions);
  }

  const transactions = await Transaction.find({ user: request.user._id })
    .sort({
      createdAt: -1,
    })
    .populate("product");
  return response.json(transactions);
});

// Get a single transaction detail
router.get("/:id", userExtractor, async (request, response) => {
  if (request.user.role === "admin") {
    const transaction = await Transaction.findById(request.params.id);
    return response.json(transaction);
  }

  const transaction = await Transaction.findOne({
    _id: request.params.id,
    user: request.user._id,
  });

  return response.json(transaction);
});

// Create a new transaction
router.post("/", userExtractor, async (request, response) => {
  const { productID, reference, trxRef, type, recurring } = request.body;

  if (!productID || !reference || !trxRef || !type || recurring === undefined) {
    return response.status(400).json({ error: "All fields are required" });
  }

  const startDate = new Date();
  const endDate = new Date(new Date().setMonth(startDate.getMonth() + 1));
  let medium = await paystack.getPaymentMethod(reference);

  const transaction = new Transaction({
    user: request.user._id,
    product: productID,
    reference,
    trxRef,
    type,
    medium,
    recurring,
    startDate,
    endDate,
  });

  try {
    const savedTransaction = await transaction.save();

    // TODO: Setup scheduled task for recurring transactions
    // TODO: Send alert to admin and receipt to user
    // TODO: Setup scheduled task based on user and admin preferences

    return response.json(savedTransaction);
  } catch (error) {
    return response.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/", userExtractor, async (request, response) => {
  if (request.user.role !== "admin") {
    return response.status(403).json({ error: "Unauthorized" });
  }
  await Transaction.deleteMany({});
  return response.status(204).end();
});

module.exports = router;
