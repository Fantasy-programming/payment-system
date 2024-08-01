import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import type { IUser, UserModel } from "../types/User.type";

const userSchema = new mongoose.Schema<IUser, UserModel>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, trim: true },
  phone: {
    type: String,
    unique: true,
    required: true,
    minlength: 10,
    maxlength: 10,
  },
  password: { type: String, required: true, minlength: 3 },
  zone: { type: String, required: true },
  address: { type: String, required: true },
  routerID: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const User: UserModel = mongoose.model<IUser, UserModel>(
  "User",
  userSchema,
);
