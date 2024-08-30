import { User } from "../models/User";

import type { ObjectId } from "mongoose";
import type { SupportRequest, TransferRequest } from "../types/Support.type";
import { sendSupportMail } from "../lib/mail";

const requestSupport = async (id: ObjectId, message: SupportRequest) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  await sendSupportMail(
    user?.email,
    user?.firstName,
    user?.lastName,
    user?.phone,
    user?.address,
    message.message,
    "support",
  );
};

const requestTransfert = async (id: ObjectId, message: TransferRequest) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  sendSupportMail(
    user?.email,
    user?.firstName,
    user?.lastName,
    user?.phone,
    user?.address,
    message.newAddress,
    "transfer",
  );
};

export default { requestSupport, requestTransfert };
