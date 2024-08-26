import bcrypt from "bcrypt";
import logger from "../logger";
import { User } from "../models/User";
import { AdminAlert } from "../models/AdminPreference";

export async function createAdmin() {
  // Clean up the old admin
  logger.info("Cleaning up old admin...");
  await User.deleteMany({ role: "admin " });

  // Creating admin
  logger.info("Creating admin...");
  const password = await bcrypt.hash("123456Admin@", 10);

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
  });

  const data = await admin.save();

  logger.info("Admin created successfully!");
  logger.info("Setting up preferences...");

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

  logger.info("Preferences set up successfully!");
}

export async function createUser() {
  //cleaning up old user
  logger.info("Cleaning up old user...");
  await User.deleteMany({ role: "user" });

  // creating user
  logger.info("Creating users...");
  const password = await bcrypt.hash("123456User@", 10);

  const user = new User({
    firstName: "John",
    lastName: "doe",
    password,
    email: "test123@gmail.com",
    phone: "0566070808",
    zone: "Beijing",
    address: "123 china town",
    status: "active",
    routerID: "02433",
    emailVerified: true,
    phoneVerified: true,
    role: "user",
  });

  await user.save();
  logger.info("Admin created successfully!");
}
