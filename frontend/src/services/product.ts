import axios from "@/lib/axios";
import { Products } from "./product.types";

const BASEURI = "/products";

const getProduct = async (id: string) => {
  const response = await axios.get<Products>(`${BASEURI}/${id}`);
  return response.data;
};

const getProducts = async () => {
  const response = await axios.get<Products[]>(`${BASEURI}`);
  return response.data;
};

export default { getProduct, getProducts };
