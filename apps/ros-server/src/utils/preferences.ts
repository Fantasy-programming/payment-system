import { AdminAlert } from "../models/admin-preference.model"
import type { AdminAlertingRequest } from "../types/preference.type"

/**
 * Holds the admin preferences settings. It's initially null and gets populated on server startup.
 */
export let adminPreferences: AdminAlertingRequest | null = null

/**
 * Loads the admin preferences from the database.
 * If the preferences are not found, it throws an error.
 * If found, it assigns the preferences to the adminPreferences variable.
 *
 * @throws Will throw an error if the admin preferences cannot be loaded.
 */

export async function loadAdminPreferences() {
  try {
    const preferences = await AdminAlert.findOne({})

    if (!preferences) {
      console.info("Admin preferences not found. Creating new admin...")
      throw new Error("Admin preferences not found.")
    }

    console.info("🟢 Admin preferences loaded successfully")
    adminPreferences = preferences.toObject()
  } catch (error) {
    console.error("🔴 Error loading admin preferences:", error)
    throw error
  }
}

export async function updateAdminPreferences(preferences: AdminAlertingRequest) {
  if (!preferences) throw new Error("Invalid preferences provided.")
  
  adminPreferences = preferences
  console.info("🟢 Admin preferences updated successfully")
}
