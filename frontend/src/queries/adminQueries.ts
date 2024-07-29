import userService from "@/services/user";
import trscService from "@/services/transaction";
import productService from "@/services/product";

export const adminUsersQuery = () => ({
  queryKey: ["admin", "users"],
  queryFn: userService.getUsers,
});

export const adminProductsQuery = () => ({
  queryKey: ["admin", "products"],
  queryFn: productService.getProducts,
});

export const adminTransactionsQuery = () => ({
  queryKey: ["admin", "transactions"],
  queryFn: trscService.getTransactions,
});
