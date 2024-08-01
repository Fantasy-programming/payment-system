import mongoose from "mongoose";
import logger from "../logger";

import { MONGODB_URI } from "../env";

// connected to the database

export async function initDB() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}
