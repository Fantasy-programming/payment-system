import axios from "@/lib/axios";
import { Product, ProductRequest } from "./product.types";

const BASEURI = "/products";

const getProduct = async (id: string) => {
  const response = await axios.get<Product>(`${BASEURI}/${id}`);
  return response.data;
};

const createProduct = async (data: ProductRequest) => {
  const response = await axios.post<Product>(`${BASEURI}`, data);
  return response.data;
};

const updateProduct = async (id: string, data: ProductRequest) => {
  const response = await axios.put<Product>(`${BASEURI}/${id}`, data);
  return response.data;
};

const getProducts = async () => {
  const response = await axios.get<Product[]>(`${BASEURI}`);
  return response.data;
};

const deleteProduct = async (id: string | string[]) => {
  await axios.delete<Product>(`${BASEURI}`, {
    data: { ids: id },
  });
};

export default {
  getProduct,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
};
