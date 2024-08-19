import mongoose from "mongoose";
import logger from "../logger";

import { MONGODB_URI } from "../env";
import { loadAdminPreferences } from "./preferences";

// connected to the database

/**
 * Initializes the MongoDB database connection and loads admin preferences.
 * @throws Will throw an error if the connection fails or admin preferences cannot be loaded.
 */
export async function initDB() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    logger.info("🟢 Connected to MongoDB");

    await loadAdminPreferences();
  } catch (error) {
    logger.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
}

/**
 * Gets the active MongoDB database connection.
 * @returns The MongoDB database instance.
 */

export async function getConnection() {
  return mongoose.connection.db;
}

/**
 * Closes the MongoDB database connection.
 * @throws Will throw an error if the connection cannot be closed.
 */

export async function closeDB() {
  await mongoose.connection.close();
  logger.info("🔴 Disconnected from MongoDB");
}
