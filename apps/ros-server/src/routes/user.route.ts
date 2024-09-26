import { Router } from "express"

// import { validateData, validateParams } from "../middlewares/validation.middleware"
// import { createUserSchema, updateUserSchema, userPersonalUpdateSchema } from "../types/user.type"

import userController from "../controllers/user.controller"

const userRouter = Router()

// Get all users
userRouter.get("/", userController.getUsers)

export default userRouter
