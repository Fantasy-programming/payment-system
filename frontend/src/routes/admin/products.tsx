import { columns } from "./products-column";
import { DataTable } from "./products-table";

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
import { adminProductsQuery } from "@/queries/adminQueries";
import { useQuery } from "@tanstack/react-query";

export const AdminProductsView = () => {
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery(adminProductsQuery());

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="py-6">
        <Card>
          <div className="flex items-center">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
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
                  Add Product
                </span>
              </Button>
            </div>
          </div>
          <CardContent>
            {isProductsLoading ? (
              <div>Loading...</div>
            ) : isProductsError ? (
              <div>Error</div>
            ) : (
              <>{products && <DataTable columns={columns} data={products} />}</>
            )}
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
