import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userTransactionQuery } from "@/queries/userQueries";

import { Receipt } from "@/components/ui/receipt";

export const HistoryDetailView = () => {
  const { id } = useParams<"id">();
  const { data: transaction } = useSuspenseQuery(
    userTransactionQuery(id ?? ""),
  );

  return (
    <>{transaction && <Receipt mode="full" transaction={transaction} />}</>
  );
};
