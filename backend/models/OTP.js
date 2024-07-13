const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 10 },
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
