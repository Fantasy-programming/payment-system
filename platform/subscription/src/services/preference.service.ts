import type { ObjectId } from "mongoose";
import type {
  AdminAlertingRequest,
  UserAlertingRequest,
} from "../types/preference.type";
import { UserAlert } from "../models/user-preference.model";
import { AdminAlert } from "../models/admin-preference.model";
import { updateAdminPreferences } from "../utils/preferences";

const getUserAlertingSettings = async (id: ObjectId) => {
  const settings = await UserAlert.findOne({ userId: id });
  return settings;
};

const getAdminAlertingSettings = async (id: ObjectId) => {
  const settings = await AdminAlert.findOne({ userId: id });
  return settings;
};

const updateUserAlertingSettings = async (
  id: ObjectId,
  data: UserAlertingRequest,
) => {
  const updatedAt = new Date();
  const settingsUpdate = { ...data, updatedAt };

  const updated = await UserAlert.findOneAndUpdate(
    { userId: id },
    {
      $set: settingsUpdate,
    },
    { new: true, runValidators: true },
  );

  //TODO: SETUP Schedulers and so in various services (based on preferences)

  return updated;
};

const updateAdminAlertingSettings = async (
  id: ObjectId,
  data: AdminAlertingRequest,
) => {
  const updatedAt = new Date();
  const settingsUpdate = { ...data, updatedAt };
  const updated = await AdminAlert.findOneAndUpdate(
    { userId: id },
    { $set: settingsUpdate },
    { new: true, runValidators: true },
  );

  // Update the preferences app-wide
  updateAdminPreferences(data);

  return updated;
};

export default {
  getUserAlertingSettings,
  getAdminAlertingSettings,
  updateUserAlertingSettings,
  updateAdminAlertingSettings,
};
