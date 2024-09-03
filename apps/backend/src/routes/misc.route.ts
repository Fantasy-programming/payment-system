import { Router } from "express";
import mistController from "../controllers/mist.controller";

const mistRouter = Router();

mistRouter.get("/", mistController);

export default mistRouter;
