import { User } from "../models/User";
import { InternalError, UnauthorizedError } from "../utils/errors";
import { sendNewPassEmail, sendWelcomeMail } from "../lib/mail";
import { generatePassword } from "../utils/password";

import type { ObjectId } from "mongoose";
import type {
  IUserCreate,
  IUserPersonalUpdate,
  IUserUpdate,
} from "../types/User.type";

const getAll = async () => {
  const users = await User.find({
    role: { $ne: "admin" },
    status: { $ne: "inactive" },
  }).sort({ createdAt: -1 });

  return users;
};

const getOne = async (id: ObjectId) => {
  const user = await User.findById(id);
  return user;
};

const create = async (user: IUserCreate) => {
  const exist = await User.findOne({
    $or: [
      { email: user.email, status: "active" },
      { phone: user.phone, status: "active" },
      { routerID: user.routerID, status: "active" },
    ],
  });

  if (exist) {
    throw new UnauthorizedError(
      "A user with the same email, phone number or router ID already exist",
    );
  }

  const passHash = await Bun.password.hash(user.password);
  const newUser = new User({ ...user, password: passHash });
  const savedUser = await newUser.save();

  //Send onboarding email to user
  await sendWelcomeMail(
    user.email,
    user.firstName,
    user.lastName,
    user.password,
  );

  return savedUser;
};

const updateOne = async (id: ObjectId, user: IUserUpdate) => {
  const updatedAt = new Date();

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { ...user, updatedAt },
    { new: true, runValidators: true },
  );

  return updatedUser;
};

const updateUser = async (id: ObjectId, user: IUserPersonalUpdate) => {
  const updatedAt = new Date();

  if (user.password) {
    const passHash = await Bun.password.hash(user.password);
    user.password = passHash;
  }

  const userUpdate = { ...user, updatedAt };

  const updated = await User.findByIdAndUpdate(
    id,
    {
      $set: userUpdate,
    },
    { new: true, runValidators: true },
  );

  return updated;
};

const resetPassword = async (id: ObjectId) => {
  const password = generatePassword(8);
  const passHash = await Bun.password.hash(password);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { password: passHash },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    sendNewPassEmail(user.email, password);
  } catch (error) {
    throw new InternalError("Error resetting password");
  }
};

const remove = async (ids: ObjectId[] | ObjectId) => {
  let id = ids;

  if (!Array.isArray(ids)) {
    id = [ids];
  }

  await User.updateMany({ _id: { $in: id } }, { $set: { status: "inactive" } });
};

export default {
  getAll,
  getOne,
  create,
  remove,
  updateOne,
  updateUser,
  resetPassword,
};
