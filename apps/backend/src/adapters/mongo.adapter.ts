import mongoose from "mongoose"

import env from "../env"
import { loadAdminPreferences } from "../utils/preferences"
import type { Logger, LogInstance } from "@mikronet/logger"

export class Db {
  private mongoUri: string
  private logger: LogInstance

  constructor(logger: Logger) {
    this.mongoUri = env.MONGODB_URI
    this.logger = logger.logger
  }

  /**
   * Initializes the MongoDB database connection and loads admin preferences.
   * @throws Will throw an error if the connection fails or admin preferences cannot be loaded.
   */

  async init() {
    try {
      await mongoose.connect(this.mongoUri)
      this.logger.info("🟢 Connected to MongoDB")
      await loadAdminPreferences()
      this.logger.info("🟢 Admin preferences loaded")
    } catch (error) {
      this.logger.error("Error connecting to MongoDB")
      this.logger.error(error)
      process.exit(1)
    }
  }

  /**
   * Gets the active MongoDB database connection.
   * @returns The MongoDB database instance.
   */
  getCon() {
    return mongoose.connection.db
  }

  /**
   * Sets the MongoDB URI to be used for database connection.
   * This function is primarily used for testing with TestContainers.
   * @param uri - The MongoDB connection string to be used
   */

  setMongoUri(uri: string) {
    this.mongoUri = uri
  }

  /**
   * Closes the MongoDB database connection.
   * @throws Will throw an error if the connection cannot be closed.
   */
  async close() {
    await mongoose.disconnect()
    this.logger.info("🔴 Disconnected from MongoDB")
  }
}
