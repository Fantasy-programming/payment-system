import type { ObjectId } from "mongoose";
import type { UserAlertingRequest } from "../types/Preference.type";
import { UserAlert } from "../models/UserPreference";

const getUserAlertingSettings = async (id: ObjectId) => {
  const settings = await UserAlert.findOne({ userId: id });
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

export default { getUserAlertingSettings, updateUserAlertingSettings };
