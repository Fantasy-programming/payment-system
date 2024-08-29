import userService from "../services/user.service";
import { invalidateCache } from "../middlewares/cache.middleware";

import type { Request, Response } from "express";
import type { IdParam, Ids } from "../types/api.type";
import type {
  IUserCreate,
  IUserPersonalUpdate,
  IUserUpdate,
} from "../types/user.type";

const getUsers = async (request: Request, response: Response) => {
  if (request?.user?.role !== "admin") {
    return response.status(403).json({ error: "Unauthorized" });
  }

  const data = await userService.getAll();
  return response.json(data);
};

const getCurrentUser = async (request: Request, response: Response) => {
  return response.json(request.user);
};

const getUser = async (request: Request, response: Response) => {
  const { id } = request.params as unknown as IdParam;
  const user = await userService.getOne(id);
  response.json(user);
};

const createUser = async (request: Request, response: Response) => {
  const body = request.body as IUserCreate;
  const redis = request.app.locals.cache;
  await userService.create(body);
  await invalidateCache(redis, "users");

  response.status(200).json({ message: "User created Successfully" });
};

const updateUser = async (request: Request, response: Response) => {
  const body = request.body as IUserUpdate;
  const redis = request.app.locals.cache;
  const { id } = request.params as unknown as IdParam;
  const data = await userService.updateOne(id, body);
  await invalidateCache(redis, "users");

  response.json(data);
};

const updateCurrentUser = async (request: Request, response: Response) => {
  const userId = request.user?._id;
  const redis = request.app.locals.cache;

  const body = request.body as IUserPersonalUpdate;
  const data = await userService.updateUser(userId!, body);
  await invalidateCache(redis, "users");

  response.json(data);
};

const deleteUsers = async (request: Request, response: Response) => {
  const { ids } = request.body as Ids;
  const redis = request.app.locals.cache;

  await userService.remove(ids);
  await invalidateCache(redis, "users");

  response.status(204).end();
};

const resetPassword = async (request: Request, response: Response) => {
  const { id } = request.params as unknown as IdParam;

  await userService.resetPassword(id);

  response.status(200).json({ message: "Password reset successfully" });
};

export default {
  getUsers,
  getCurrentUser,
  getUser,
  resetPassword,
  createUser,
  updateUser,
  updateCurrentUser,
  deleteUsers,
};
