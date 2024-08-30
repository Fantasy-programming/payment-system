import { columns } from "./_components/products-column";
import { DataTable } from "./_components/products-table";

import { adminProductsQuery } from "@/queries/adminQueries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AdminProductsView = () => {
  const { data: products } = useSuspenseQuery(adminProductsQuery());

  return (
    <main className="flex flex-col h-full overflow-hidden py-0 sm:py-2 ">
      <div className="flex-1 overflow-auto p-4 sm:px-6">
        {products && <DataTable columns={columns} data={products} />}
      </div>
    </main>
  );
};
