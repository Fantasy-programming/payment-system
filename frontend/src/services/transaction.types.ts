import { UserInfo } from "./user.types";
import { Products } from "./product.types";

export interface Transaction {
  id: string;
  user: UserInfo;
  product: Products;
  reference: string;
  trxRef: string;
  type: string;
  medium: string;
  recurring: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionRequest = Omit<
  Transaction,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "startDate"
  | "endDate"
  | "user"
  | "medium"
  | "product"
> & {
  productID: string;
};
