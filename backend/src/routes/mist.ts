import { Router } from "express";
import mistController from "../controllers/mistController";

const mistRouter = Router();

mistRouter.get("/", mistController);

export default mistRouter;
