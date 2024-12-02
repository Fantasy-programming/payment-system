import { Router } from "express";
import { userExtractor } from "../middlewares/jwt.middleware";

import {
  validateData,
  validateParams,
} from "../middlewares/validation.middleware";
import { idparam, idsSchema } from "../types/api.type";
import {
  createUserSchema,
  updateUserSchema,
  userPersonalUpdateSchema,
} from "../types/user.type";

import userController from "../controllers/user.controller";
import { checkCache } from "../middlewares/cache.middleware";

const userRouter = Router();

// Get all users
userRouter.get("/", userExtractor, checkCache, userController.getUsers);

// Get current user info
userRouter.get("/me", userExtractor, checkCache, userController.getCurrentUser);

// Update current user info
userRouter.put(
  "/me",
  userExtractor,
  validateData(userPersonalUpdateSchema),
  userController.updateCurrentUser,
);

// Get a single user detail
userRouter.get(
  "/:id",
  userExtractor,
  checkCache,
  validateParams(idparam),
  userController.getUser,
);

// Create a new user
userRouter.post(
  "/",
  userExtractor,
  validateData(createUserSchema),
  userController.createUser,
);

// Update a user
userRouter.put(
  "/:id",
  userExtractor,
  validateParams(idparam),
  validateData(updateUserSchema),
  userController.updateUser,
);

// Delete one or more users
userRouter.delete(
  "/",
  userExtractor,
  validateData(idsSchema),
  userController.deleteUsers,
);

userRouter.post(
  "/reset-password/:id",
  userExtractor,
  validateParams(idparam),
  userController.resetPassword,
);

export default userRouter;
