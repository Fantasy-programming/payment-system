import bcrypt from "bcrypt";

import type { ObjectId } from "mongoose";
import { User } from "../models/User";
import { CommonError } from "../utils/errors";
import type { IUserCreate, IUserUpdate } from "../types/User.type";

const getAll = async () => {
  const users = await User.find({
    role: { $ne: "admin" },
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
      { email: user.email },
      { phone: user.phone },
      { routerID: user.routerID },
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

const remove = async (ids: ObjectId[] | ObjectId) => {
  let id = ids;

  if (!Array.isArray(ids)) {
    id = [ids];
  }

  await User.updateMany({ _id: { $in: id } }, { $set: { status: "inactive" } });
};

export default { getAll, getOne, create, remove, updateOne };
