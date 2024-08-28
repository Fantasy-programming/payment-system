import mongoose from "mongoose";
import logger from "../logger";

import { MONGODB_URI } from "../env";
import { loadAdminPreferences } from "./preferences";

export const getConnection = async () => {
  return mongoose.connection.db;
};

export class DB {
  private mongoUri: string;

  constructor() {
    this.mongoUri = MONGODB_URI as string;
  }

  /**
   * Initializes the MongoDB database connection and loads admin preferences.
   * @throws Will throw an error if the connection fails or admin preferences cannot be loaded.
   */

  async init() {
    try {
      await mongoose.connect(this.mongoUri);
      logger.info("🟢 Connected to MongoDB");
      await loadAdminPreferences();
      logger.info("🟢 Admin preferences loaded");
    } catch (error) {
      logger.error("Error connecting to MongoDB");
      logger.error(error);
      process.exit(1);
    }
  }

  /**
   * Gets the active MongoDB database connection.
   * @returns The MongoDB database instance.
   */
  getCon() {
    return mongoose.connection.db;
  }

  /**
   * Sets the MongoDB URI to be used for database connection.
   * This function is primarily used for testing with TestContainers.
   * @param uri - The MongoDB connection string to be used
   */

  setMongoUri(uri: string) {
    this.mongoUri = uri;
  }

  /**
   * Closes the MongoDB database connection.
   * @throws Will throw an error if the connection cannot be closed.
   */
  async close() {
    await mongoose.disconnect();
    logger.info("🔴 Disconnected from MongoDB");
  }
}
