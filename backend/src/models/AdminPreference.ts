import mongoose from "mongoose";
import type {
  AdminAlertingSettings,
  AdminAlertingModel,
} from "../types/Preference.type";

const adminAlertSchema = new mongoose.Schema<
  AdminAlertingSettings,
  AdminAlertingModel
>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  emailAlerts: { type: Boolean, default: true },
  smsAlerts: { type: Boolean, default: false },
  leaveAlertEmail: { type: String, required: false },
  problemAlertEmail: { type: String, required: false },
  activationAlertEmail: { type: String, required: false },
  leaveAlertPhone: { type: String, required: false },
  problemAlertPhone: { type: String, required: false },
  activationAlertPhone: { type: String, required: false },
  leaveAlert: { type: Boolean, default: false },
  problemAlert: { type: Boolean, default: false },
  activationAlert: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

adminAlertSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.userId;
  },
});

export const AdminAlert: AdminAlertingModel = mongoose.model<
  AdminAlertingSettings,
  AdminAlertingModel
>("AdminAlert", adminAlertSchema);
