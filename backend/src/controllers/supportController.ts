import supportService from "../services/supportService";

import type { Request, Response } from "express";
import type { SupportRequest, TransferRequest } from "../types/Support.type";

const requestSupport = async (request: Request, response: Response) => {
  const id = request.user?.id;
  const body = request.body as SupportRequest;
  await supportService.requestSupport(id!, body);
  response.status(200).json({ message: "Support requested successfully" });
};

const requestTransfert = async (request: Request, response: Response) => {
  const id = request.user?.id;
  const body = request.body as TransferRequest;
  await supportService.requestTransfert(id!, body);
  response.status(200).json({ message: "Transfert requested successfully" });
};

export default { requestSupport, requestTransfert };
