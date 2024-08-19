import { api as axios } from "@/lib/axios";
import { Transaction, TransactionRequest } from "./transaction.types";

const BASEURI = "/transactions";

const getTransaction = async (id: string) => {
  const response = await axios.get<Transaction>(`${BASEURI}/${id}`);
  return response.data;
};

const getTransactions = async () => {
  const response = await axios.get<Transaction[]>(`${BASEURI}`);
  return response.data;
};

const createTransaction = async (data: TransactionRequest) => {
  const response = await axios.post<Transaction>(`${BASEURI}`, data);
  return response.data;
};

export default { getTransactions, getTransaction, createTransaction };
