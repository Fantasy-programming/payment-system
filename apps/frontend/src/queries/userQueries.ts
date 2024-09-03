import userService from "@/services/user";
import trscService from "@/services/transaction";
import productService from "@/services/product";
import preferenceService from "@/services/preference";

export const userInfoQuery = () => ({
  queryKey: ["user", "me"],
  queryFn: userService.getMe,
});

export const usePrefQuery = () => ({
  queryKey: ["user", "preferences"],
  queryFn: preferenceService.getPrefs,
});

export const userProductsQuery = () => ({
  queryKey: ["user", "products"],
  queryFn: productService.getProducts,
});

export const userTransactionsQuery = () => ({
  queryKey: ["user", "transactions"],
  queryFn: trscService.getTransactions,
});

export const userTransactionQuery = (id: string) => ({
  queryKey: ["user", "transaction", id],
  queryFn: async () => trscService.getTransaction(id),
});
