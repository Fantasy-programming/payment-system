import type { ObjectId } from "mongoose";
import type { SupportRequest, TransferRequest } from "../types/Support.type";

const requestSupport = async (id: ObjectId, message: SupportRequest) => {
  // TODO: Send a mail to the support service
  return true;
};

const requestTransfert = async (id: ObjectId, message: TransferRequest) => {
  // TODO: Send a mail to the support service
  return true;
};

export default { requestSupport, requestTransfert };
