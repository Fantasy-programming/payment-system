import { columns } from "./_components/products-column";
import { DataTable } from "./_components/products-table";

import { adminProductsQuery } from "@/queries/adminQueries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AdminProductsView = () => {
  const { data: products } = useSuspenseQuery(adminProductsQuery());

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="py-6">
        {products && <DataTable columns={columns} data={products} />}
      </div>
    </main>
  );
};
