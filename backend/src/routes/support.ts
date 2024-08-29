import { Router } from "express";

import { validateData } from "../middlewares/validation";
import supportController from "../controllers/supportController";
import { supportReqSchema, transferReqSchema } from "../types/Support.type";
import { userExtractor } from "../middlewares/jwt";

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
