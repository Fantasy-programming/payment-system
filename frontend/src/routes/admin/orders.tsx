import { columns } from "./_components/orders-column";
import { DataTable } from "./_components/orders-table";

import { adminTransactionsQuery } from "@/queries/adminQueries";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { ordersLoader } from "./loaders";

export const AdminOrdersView = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof ordersLoader>>
  >;

  const { data: orders } = useQuery({
    ...adminTransactionsQuery(),
    initialData: initialData,
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="py-6">
        <>{orders && <DataTable columns={columns} data={orders} />}</>
      </div>
    </main>
  );
};
