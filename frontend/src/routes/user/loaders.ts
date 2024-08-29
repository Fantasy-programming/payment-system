import { QueryClient } from "@tanstack/react-query";
import {
  userInfoQuery,
  userTransactionsQuery,
  userProductsQuery,
  usePrefQuery,
  userTransactionQuery,
} from "@/queries/userQueries";
import { Params } from "react-router-dom";

export const homeLoader = (queryClient: QueryClient) => async () => {
  const userQuery = userInfoQuery();
  const trscQuery = userTransactionsQuery();

  const [user, transactions] = await Promise.all([
    queryClient.ensureQueryData(userQuery),
    queryClient.ensureQueryData(trscQuery),
  ]);

  return { user, transactions };
};

export const settingsLoader = (queryClient: QueryClient) => async () => {
  const userQuery = userInfoQuery();
  const prefQuery = usePrefQuery();

  const [user, preferences] = await Promise.all([
    queryClient.ensureQueryData(prefQuery),
    queryClient.ensureQueryData(userQuery),
  ]);

  return { user, preferences };
};

export const historyLoader = (queryClient: QueryClient) => async () => {
  const trscQuery = userTransactionsQuery();

  const transactions = await queryClient.ensureQueryData(trscQuery);
  return transactions;
};

export const productsLoader = (queryClient: QueryClient) => async () => {
  const productsQuery = userProductsQuery();

  const products = await queryClient.ensureQueryData(productsQuery);
  return products;
};

export const historyDetailLoader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: Params<"id"> }) => {
    const trscQuery = userTransactionQuery(params.id ?? "");

    const transaction = await queryClient.ensureQueryData(trscQuery);
    return transaction;
  };
