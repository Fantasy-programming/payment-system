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

export const adminUserQuery = (id: string) => ({
  queryKey: ["admin", "user", id],
  queryFn: async () => userService.getUser(id),
});

export const adminProductQuery = (id: string) => ({
  queryKey: ["admin", "product", id],
  queryFn: async () => productService.getProduct(id),
});

export const adminTransactionsQuery = () => ({
  queryKey: ["admin", "transactions"],
  queryFn: trscService.getTransactions,
});
