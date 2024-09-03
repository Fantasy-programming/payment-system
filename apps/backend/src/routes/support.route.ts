import { Router } from "express";

import { validateData } from "../middlewares/validation.middleware";
import supportController from "../controllers/support.controller";
import { supportReqSchema, transferReqSchema } from "../types/support.type";
import { userExtractor } from "../middlewares/jwt.middleware";

const supportRouter = Router();

// Ask for support
supportRouter.post(
  "/sup",
  userExtractor,
  validateData(supportReqSchema),
  supportController.requestSupport,
);

// Request transfert

supportRouter.post(
  "/transfert",
  userExtractor,
  validateData(transferReqSchema),
  supportController.requestTransfert,
);

export default supportRouter;
