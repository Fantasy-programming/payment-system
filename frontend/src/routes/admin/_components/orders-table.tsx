import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Transaction } from "@/services/transaction.types";
import { useCSVExport } from "@/hooks/useCSVExport";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface MetaProps {
  gotoPage: (page: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const { exportToCSV } = useCSVExport();

  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    meta: {
      gotoPage: (page: string) => {
        navigate(page);
      },
    },
    state: {
      rowSelection,
    },
  });

  // prepare the csv data and mount the csvDownload
  const handleCsvDownload = useCallback(() => {
    const response = confirm("Export selected data to csv ?");

    if (!response) {
      return;
    }

    const csvData = table.getFilteredSelectedRowModel().flatRows.map((row) => {
      const transaction = row.original as Transaction;

      return {
        id: transaction.trxRef,
        plan: transaction.product.name,
        "product price": transaction.product.price,
        price: transaction.finalPrice,
        duration: transaction.duration,
        type: transaction.type,
        medium: transaction.medium,
        reference: transaction.reference,
        startDate: transaction.startDate,
        endDate: transaction.endDate,
      };
    });

    exportToCSV(csvData, "transactions.csv");
  }, [table, exportToCSV]);

  return (
    <Card>
      <div className="flex items-center overflow-x-scroll overflow-y-scroll">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Manage your transactions.</CardDescription>
        </CardHeader>
        <div className="ml-auto flex items-center gap-2 space-y-1.5 p-6">
          {rowSelection &&
          table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1"
              onClick={handleCsvDownload}
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
          ) : null}
        </div>
      </div>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
