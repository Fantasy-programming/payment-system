import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { userTransactionsQuery } from "@/queries/userQueries";

import { DataTable } from "./_components/historyTable";
import { columns } from "./_components/historyTableCol";

export const HistoryView = () => {
  const { data: transactions } = useSuspenseQuery(userTransactionsQuery());

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <DataTable data={transactions} columns={columns} />
      </div>
      <div>
        <Outlet />
      </div>
    </main>
  );
};
