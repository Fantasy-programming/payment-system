import { QueryClient } from "@tanstack/react-query";
import {
  userInfoQuery,
  userTransactionsQuery,
  userProductsQuery,
} from "@/queries/userQueries";

export const homeLoader = (queryClient: QueryClient) => async () => {
  const userQuery = userInfoQuery();
  const trscQuery = userTransactionsQuery();

  const [user, transactions] = await Promise.all([
    queryClient.ensureQueryData(userQuery),
    queryClient.ensureQueryData(trscQuery),
  ]);

  return { user, transactions };
};

export const historyLoader = (queryClient: QueryClient) => async () => {
  const trscQuery = userTransactionsQuery();

  const transactions = await queryClient.ensureQueryData(trscQuery);
  return { transactions };
};

export const productsLoader = (queryClient: QueryClient) => async () => {
  const productsQuery = userProductsQuery();

  const products = await queryClient.ensureQueryData(productsQuery);
  return { products };
};
