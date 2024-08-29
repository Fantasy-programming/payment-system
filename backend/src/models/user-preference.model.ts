import mongoose from "mongoose";
import type {
  UserAlertingSettings,
  UserAlertingModel,
} from "../types/preference.type";

const userAlertSchema = new mongoose.Schema<
  UserAlertingSettings,
  UserAlertingModel
>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  emailAlerts: { type: Boolean, default: true },
  smsAlerts: { type: Boolean, default: false },
  subscriptionAlert: { type: Boolean, default: true },
  productAlert: { type: Boolean, default: false },
  receiptEmail: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userAlertSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.userId;
  },
});

export const UserAlert: UserAlertingModel = mongoose.model<
  UserAlertingSettings,
  UserAlertingModel
>("UserAlert", userAlertSchema);
