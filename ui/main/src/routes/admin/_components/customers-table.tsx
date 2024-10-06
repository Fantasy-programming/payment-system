import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { File, PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import userService from "@/services/user";
import { toast } from "sonner";
import { User } from "@/services/user.types";
import { LoadingButton } from "@/components/ui/loading-button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface MetaProps {
  gotoPage: (page: string) => void;
  deleteCustomer: (id: string) => void;
  resetPassword: (id: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteCustomer = async (id: string | string[]) => {
    if (confirm("Please confirm you want to delete this record.")) {
      setLoading(true);
      await userService.deleteUsers(id);
      await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setLoading(false);
      toast.success("User deleted successfully.");
    }
  };

  const resetPassword = async (id: string) => {
    if (confirm("Please confirm you want to reset this user's password.")) {
      const promise = userService.resetPassword(id);

      toast.promise(promise, {
        loading: "Resetting password...",
        success: "User password has been reset 👌",
        error: "Error resetting password 🤯",
      });

      await promise;
    }
  };

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
      deleteCustomer,
      resetPassword,
    },
    state: {
      rowSelection,
    },
  });

  const handleDelete = async () => {
    const rows = table.getFilteredSelectedRowModel().flatRows.map((row) => {
      return (row.original as User).id;
    });

    await deleteCustomer(rows);
  };

  return (
    <Card>
      <div className="flex items-center">
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>
            Manage your clients and view their information.
          </CardDescription>
        </CardHeader>
        <div className="ml-auto flex items-center gap-2  p-6">
          {rowSelection &&
          table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <LoadingButton
              size="sm"
              loading={loading}
              variant="destructive"
              className="h-8 gap-1"
              onClick={handleDelete}
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Delete Selected
              </span>
            </LoadingButton>
          ) : null}
          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => navigate("new")}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Client
            </span>
          </Button>
        </div>
      </div>
      <CardContent>
        <div>
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
