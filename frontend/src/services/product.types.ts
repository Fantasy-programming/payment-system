export interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  rate: string;
  cap: string;
  capDownTo: string;
  hasCap: boolean;
  hasPublicIp: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProductRequest = Omit<Products, "id" | "createdAt" | "updatedAt">;
