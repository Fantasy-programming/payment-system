import mongoose from "mongoose";
import type { IUser, UserModel } from "../types/User.type";
import { UserAlert } from "./UserPreference";

const userSchema = new mongoose.Schema<IUser, UserModel>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: {
    type: String,
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

// userSchema.pre("find", function () {
//   if (this.model.modelName === "User") {
//     this.where({ status: { $ne: "inactive" } });
//   }
// });
//
// userSchema.pre("findOne", function () {
//   if (this.model.modelName === "User") {
//     this.where({ status: { $ne: "inactive" } });
//   }
// });

// Middleware to create a preference when a user is created
userSchema.post("save", async function (doc, next) {
  try {
    if (doc.role === "admin") {
      return;
    }

    await UserAlert.create({ userId: doc._id });
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Middleware to delete preferences when a user is soft deleted
userSchema.pre<IUser>("updateMany", async function (this, next) {
  try {
    await UserAlert.deleteMany({ userId: this._id });
    next();
  } catch (err) {
    next(err as Error);
  }
});

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
