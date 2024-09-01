import { Router } from "express";
import metricController from "../controllers/metric.controller";

const metricRouter = Router();

metricRouter.get("/", metricController.reveal);

export default metricRouter;
