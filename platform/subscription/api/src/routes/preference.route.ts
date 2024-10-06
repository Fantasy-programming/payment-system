import { Router } from "express";

import preferenceController from "../controllers/preference.controller";

import { checkCache } from "../middlewares/cache.middleware";
import { userExtractor } from "../middlewares/jwt.middleware";
import { validateData } from "../middlewares/validation.middleware";

import {
  adminAlertingRequestSchema,
  userAlertingRequestSchema,
} from "../types/preference.type";

const prefRouter = Router();

// Get the user preferences
prefRouter.get(
  "/user",
  userExtractor,
  checkCache,
  preferenceController.getUserAlertingSettings,
);

prefRouter.get(
  "/admin",
  userExtractor,
  checkCache,
  preferenceController.getAdminAlertingSettings,
);

// Update the user preferences
prefRouter.put(
  "/user",
  userExtractor,
  validateData(userAlertingRequestSchema),
  preferenceController.updateUserAlertingSettings,
);

// update the admin preferences

prefRouter.put(
  "/admin",
  userExtractor,
  validateData(adminAlertingRequestSchema),
  preferenceController.updateAdminAlertingSettings,
);

export default prefRouter;
