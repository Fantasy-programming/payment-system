import axios from "@/lib/axios";
import { SupportRequest, TransferRequest } from "./support.types";

const BASEURI = "/support";

const requestSupport = async (data: SupportRequest) => {
  await axios.post(`${BASEURI}/sup`, data);
};

const requestTransfer = async (data: TransferRequest) => {
  await axios.post(`${BASEURI}/transfert`, data);
};

export default {
  requestSupport,
  requestTransfer,
};
