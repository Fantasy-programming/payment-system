const User = require("../models/User");

const bcrypt = require("bcrypt");

async function createAdmin() {
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
    routerID: "0",
    emailVerified: true,
    phoneVerified: true,
    role: "admin",
  });

  await admin.save();

  console.log("Admin created successfully");
}

module.exports = createAdmin;
