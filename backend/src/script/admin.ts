import bcrypt from "bcrypt";
import { User } from "../models/User";

export async function createAdmin() {
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

  await admin.save();
}
