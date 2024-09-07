import { AdminAlert } from "../models/admin-preference.model"
import { User } from "../models/user.model"
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
      await createAdmin()
      throw new Error("Admin preferences not found. Created new admin.")
    }

    console.info("🟢 Admin preferences loaded successfully")
    adminPreferences = preferences.toObject()
  } catch (error) {
    console.error("🔴 Error loading admin preferences:", error)
    throw error
  }
}

async function createAdmin() {
  console.info("Creating admin...")
  const password = await Bun.password.hash("123456Admin@")

  const admin = new User({
    firstName: "Eric",
    lastName: "nyatepe",
    password,
    email: "eric@google.com",
    phone: "0596072727",
    zone: "Nigeria",
    address: "123 Omo Street",
    status: "active",
    routerID: "0",
    emailVerified: true,
    phoneVerified: true,
    role: "admin",
  })

  const data = await admin.save()

  console.info("Admin created successfully!")
  console.info("Setting up preferences...")

  const preference = new AdminAlert({
    userId: data._id,
    emailAlerts: true,
    smsAlerts: true,
    leaveAlertEmail: data.email,
    problemAlertEmail: data.email,
    activationAlertEmail: data.email,
    leaveAlertPhone: data.phone,
    problemAlertPhone: data.phone,
    activationAlertPhone: data.phone,
    leaveAlert: true,
    problemAlert: true,
    activationAlert: true,
  })

  await preference.save()

  console.info("Preferences set up successfully!")
}

export async function updateAdminPreferences(preferences: AdminAlertingRequest) {
  adminPreferences = preferences
}
