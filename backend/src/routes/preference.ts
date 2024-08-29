import { Router } from "express";

import preferenceController from "../controllers/preferenceController";

import { checkCache } from "../middlewares/cache";
import { userExtractor } from "../middlewares/jwt";
import { validateData } from "../middlewares/validation";

import {
  adminAlertingRequestSchema,
  userAlertingRequestSchema,
} from "../types/Preference.type";

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
