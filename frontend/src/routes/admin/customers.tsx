import { useSearchParams } from "react-router-dom";
import { columns } from "./_components/customers-column";
import { DataTable } from "./_components/customers-table";

import { adminUsersQuery } from "@/queries/adminQueries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AdminCustomerView = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("q") || "";

  const { data: users } = useSuspenseQuery(adminUsersQuery());

  const filtered = users.filter((user) => {
    return (
      user.firstName.toLowerCase().includes(filter) ||
      user.lastName.toLowerCase().includes(filter) ||
      user.email.toLowerCase().includes(filter) ||
      user.phone.includes(filter) ||
      user.zone.toLowerCase().includes(filter) ||
      user.address.toLowerCase().includes(filter)
    );
  });

  return (
    <main className="flex flex-col h-full overflow-hidden py-0 sm:py-2 ">
      <div className="flex-1 overflow-auto p-4 sm:px-6">
        {filtered && <DataTable columns={columns} data={filtered} />}
      </div>
    </main>
  );
};
