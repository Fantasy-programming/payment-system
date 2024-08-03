import { Router } from "express";

import preferenceController from "../controllers/preferenceController";

import { validateData } from "../middleware/validation";
import { userAlertingRequestSchema } from "../types/Preference.type";
import { userExtractor } from "../middleware/jwt";

const prefRouter = Router();

// Get the user / admin preferences
prefRouter.get(
  "/user",
  userExtractor,
  preferenceController.getUserAlertingSettings,
);

// Update the user preferences
prefRouter.put(
  "/user",
  userExtractor,
  validateData(userAlertingRequestSchema),
  preferenceController.updateUserAlertingSettings,
);

// update the admin preferences

export default prefRouter;
