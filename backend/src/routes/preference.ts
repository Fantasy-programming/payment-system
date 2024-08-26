import { Router } from "express";

import preferenceController from "../controllers/preferenceController";

import { validateData } from "../middleware/validation";
import {
  adminAlertingRequestSchema,
  userAlertingRequestSchema,
} from "../types/Preference.type";
import { userExtractor } from "../middleware/jwt";

const prefRouter = Router();

// Get the user preferences
prefRouter.get(
  "/user",
  userExtractor,
  preferenceController.getUserAlertingSettings,
);

prefRouter.get(
  "/admin",
  userExtractor,
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
