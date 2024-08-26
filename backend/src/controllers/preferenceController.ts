import preferenceService from "../services/preferenceService";

import type { Request, Response } from "express";
import type {
  AdminAlertingRequest,
  UserAlertingRequest,
} from "../types/Preference.type";

const getUserAlertingSettings = async (
  request: Request,
  response: Response,
) => {
  const id = request.user?.id;

  const data = await preferenceService.getUserAlertingSettings(id!);
  return response.status(200).json(data);
};

const getAdminAlertingSettings = async (
  request: Request,
  response: Response,
) => {
  const id = request.user?.id;

  const data = await preferenceService.getAdminAlertingSettings(id!);
  return response.status(200).json(data);
};

const updateUserAlertingSettings = async (
  request: Request,
  response: Response,
) => {
  const id = request.user?.id;

  const body = request.body as UserAlertingRequest;
  const data = await preferenceService.updateUserAlertingSettings(id!, body);
  return response.status(200).json(data);
};

const updateAdminAlertingSettings = async (
  request: Request,
  response: Response,
) => {
  const id = request.user?.id;

  const body = request.body as AdminAlertingRequest;
  const data = await preferenceService.updateAdminAlertingSettings(id!, body);
  return response.status(200).json(data);
};

export default {
  getUserAlertingSettings,
  getAdminAlertingSettings,
  updateUserAlertingSettings,
  updateAdminAlertingSettings,
};
