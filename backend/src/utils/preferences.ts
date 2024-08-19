import logger from "../logger";
import { AdminAlert } from "../models/AdminPreference";
import type { AdminAlertingSettings } from "../types/Preference.type";

/**
 * Holds the admin preferences settings. It's initially null and gets populated on server startup.
 */
export let adminPreferences: AdminAlertingSettings | null = null;

/**
 * Loads the admin preferences from the database.
 * If the preferences are not found, it throws an error.
 * If found, it assigns the preferences to the adminPreferences variable.
 *
 * @throws Will throw an error if the admin preferences cannot be loaded.
 */

export async function loadAdminPreferences() {
  try {
    const preferences = await AdminAlert.findOne({});

    if (!preferences) {
      logger.error("🔴 Something went wrong");
      throw new Error("Admin preferences not found");
    }

    logger.info("🟢 Admin preferences loaded successfully");
    adminPreferences = preferences;
  } catch (error) {
    logger.error("🔴 Error loading admin preferences:", error);
    throw error;
  }
}
