import bcrypt from "bcrypt";

import type { ObjectId } from "mongoose";
import { User } from "../models/User";
import { CommonError } from "../utils/errors";
import type {
  IUserCreate,
  IUserPersonalUpdate,
  IUserUpdate,
} from "../types/User.type";
import { sendWelcomeMail } from "../lib/mail";

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
    throw new CommonError(
      "A user with the same email, phone number or router ID already exist",
    );
  }

  const passHash = await bcrypt.hash(user.password, 10);
  const newUser = new User({ ...user, password: passHash });
  const savedUser = await newUser.save();

  // INFO: Send onboarding email to user
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
  const userUpdate = { ...user, updatedAt };

  // TODO: If we have a new password, hash it

  const updated = await User.findByIdAndUpdate(
    id,
    {
      $set: userUpdate,
    },
    { new: true, runValidators: true },
  );

  return updated;
};

const remove = async (ids: ObjectId[] | ObjectId) => {
  let id = ids;

  if (!Array.isArray(ids)) {
    id = [ids];
  }

  await User.updateMany({ _id: { $in: id } }, { $set: { status: "inactive" } });
};

export default { getAll, getOne, create, remove, updateOne, updateUser };
