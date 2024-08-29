import { Router } from "express";
import { userExtractor } from "../middlewares/jwt";

import { validateData, validateParams } from "../middlewares/validation";
import { idparam, idsSchema } from "../types/Api.type";
import {
  createUserSchema,
  updateUserSchema,
  userPersonalUpdateSchema,
} from "../types/User.type";

import userController from "../controllers/userController";

const userRouter = Router();

// Get all users
userRouter.get("/", userExtractor, userController.getUsers);

// Get current user info
userRouter.get("/me", userExtractor, userController.getCurrentUser);

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
