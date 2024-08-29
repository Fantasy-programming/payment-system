import preferenceService from "../services/preference.service";
import { invalidateCache } from "../middlewares/cache.middleware";

import type { Request, Response } from "express";
import type {
  AdminAlertingRequest,
  UserAlertingRequest,
} from "../types/preference.type";

const getUserAlertingSettings = async (
  request: Request,
  response: Response,
) => {
  const id = request.user?._id;

  const data = await preferenceService.getUserAlertingSettings(id!);
  return response.status(200).json(data);
};

const getAdminAlertingSettings = async (
  request: Request,
  response: Response,
) => {
  const id = request.user?._id;

  const data = await preferenceService.getAdminAlertingSettings(id!);
  return response.status(200).json(data);
};

const updateUserAlertingSettings = async (
  request: Request,
  response: Response,
) => {
  const id = request.user?._id;
  const redis = request.app.locals.cache;

  const body = request.body as UserAlertingRequest;
  const data = await preferenceService.updateUserAlertingSettings(id!, body);
  await invalidateCache(redis, "preferences", id!);
  return response.status(200).json(data);
};

const updateAdminAlertingSettings = async (
  request: Request,
  response: Response,
) => {
  const id = request.user?._id;
  const redis = request.app.locals.cache;

  const body = request.body as AdminAlertingRequest;
  const data = await preferenceService.updateAdminAlertingSettings(id!, body);
  await invalidateCache(redis, "preferences", id!);
  return response.status(200).json(data);
};

export default {
  getUserAlertingSettings,
  getAdminAlertingSettings,
  updateUserAlertingSettings,
  updateAdminAlertingSettings,
};
