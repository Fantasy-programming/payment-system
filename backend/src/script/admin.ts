import bcrypt from "bcrypt";
import { User } from "../models/User";
import { AdminAlert } from "../models/AdminPreference";

export async function createAdmin() {
  // Clean up the old admin

  console.log("Cleaning up old admin...");

  await User.deleteMany({ role: "admin " });

  console.log("Creating admin...");

  let password = "123456Admin@";
  password = await bcrypt.hash(password, 10);

  const admin = new User({
    firstName: "Eric",
    lastName: "nyatepe",
    password,
    email: "rocket_1@tutanota.com",
    phone: "0596060556",
    zone: "Accra",
    address: "123 Accra",
    status: "active",
    routerID: "0",
    emailVerified: true,
    phoneVerified: true,
    role: "admin",
  });

  const data = await admin.save();

  console.log("Admin created successfully!");
  console.log("Setting up preferences...");

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
  });

  await preference.save();

  console.log("Preferences set up successfully!");
}
