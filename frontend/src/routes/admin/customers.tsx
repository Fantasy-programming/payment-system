import { columns } from "./_components/customers-column";
import { DataTable } from "./_components/customers-table";

import { adminUsersQuery } from "@/queries/adminQueries";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "react-router-dom";
import { usersLoader } from "./loaders";

export const AdminCustomerView = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof usersLoader>>
  >;

  const { data: users } = useQuery({
    ...adminUsersQuery(),
    initialData: initialData,
  });

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="py-6">
        {users && <DataTable columns={columns} data={users} />}
      </div>
    </main>
  );
};
