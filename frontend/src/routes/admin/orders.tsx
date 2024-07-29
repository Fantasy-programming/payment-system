import { columns } from "./orders-column";
import { DataTable } from "./orders-table";

import { File, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <Card>
          <div className="flex items-center">
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Manage your transactions.</CardDescription>
            </CardHeader>
            <div className="ml-auto flex items-center gap-2 space-y-1.5 p-6">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Transaction
                </span>
              </Button>
            </div>
          </div>
          <CardContent>
            <>{orders && <DataTable columns={columns} data={orders} />}</>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};
