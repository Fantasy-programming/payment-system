require("dotenv").config();

const PORT = process.env.PORT;

const MONGODB_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_ATLAS_URI
    : process.env.MONGODB_LOCAL_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
