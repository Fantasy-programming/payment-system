import { QueryClient } from "@tanstack/react-query";
import {
  adminUsersQuery,
  adminTransactionsQuery,
  adminProductsQuery,
} from "@/queries/adminQueries";

export const adminHomeLoader = (queryClient: QueryClient) => async () => {
  const usersQuery = adminUsersQuery();
  const trscQuery = adminTransactionsQuery();

  const [users, transactions] = await Promise.all([
    queryClient.ensureQueryData(usersQuery),
    queryClient.ensureQueryData(trscQuery),
  ]);

  return { users, transactions };
};

export const ordersLoader = (queryClient: QueryClient) => async () => {
  const trscQuery = adminTransactionsQuery();

  const transactions = await queryClient.ensureQueryData(trscQuery);
  return transactions;
};

export const usersLoader = (queryClient: QueryClient) => async () => {
  const usersQuery = adminUsersQuery();

  const users = await queryClient.ensureQueryData(usersQuery);
  return { users };
};

export const adminProductsLoader = (queryClient: QueryClient) => async () => {
  const productsQuery = adminProductsQuery();

  const products = await queryClient.ensureQueryData(productsQuery);
  return { products };
};
