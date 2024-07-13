const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const { validatePassword, validateEmail } = require("../lib/validator");
const sendMail = require("../lib/mail");
const logger = require("../lib/logger");

const tempUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    validate: {
      validator: validateEmail,
      message: (props) => `${props.value} is not a valid email address`,
    },
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: 10,
    maxlength: 10,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: validatePassword,
      message: (_) =>
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  },
  zone: { type: String, required: true },
  address: { type: String, required: true },
  routerID: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  emailToken: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: { type: Date, default: Date.now, expires: 60 * 10 },
});

async function sendVerificationMail(email, otp) {
  try {
    const response = sendMail(email, `Email Verification ${otp}`);
    logger.info(response);
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

tempUserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 10);
  }

  if (this.isNew) {
    await sendVerificationMail(this.email, this.emailToken);
  }

  next();
});

const TempUser = mongoose.model("TempUser", tempUserSchema);
module.exports = TempUser;
