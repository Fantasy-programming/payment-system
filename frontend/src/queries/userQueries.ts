import userService from "@/services/user";
import trscService from "@/services/transaction";
import productService from "@/services/product";

export const userInfoQuery = () => ({
  queryKey: ["user", "me"],
  queryFn: userService.getMe,
});

export const userProductsQuery = () => ({
  queryKey: ["user", "products"],
  queryFn: productService.getProducts,
});

export const userTransactionsQuery = () => ({
  queryKey: ["user", "transactions"],
  queryFn: trscService.getTransactions,
});
