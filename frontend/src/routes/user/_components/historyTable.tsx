import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CSVLink } from "react-csv";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { File, ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Transaction } from "@/services/transaction.types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeLocation = location.pathname.split("/").filter(Boolean).pop();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const cleanTransactions = (data as Transaction[])?.map((transaction) => ({
    plan: transaction.product.name,
    price: transaction.product.price,
    type: transaction.type,
    medium: transaction.medium,
    creditor: "Mikronet",
    reference: transaction.reference,
    recurring: transaction.recurring,
    startDate: transaction.startDate,
    endDate: transaction.endDate,
  }));

  const handleClick = () => {
    if (!data) return false;

    if (data.length === 0) {
      alert("nothing to export");
      return false;
    }

    const response = confirm("Export data to csv ?");
    return response;
  };

  const hideit = (str: string) => {
    return str !== "trxRef" && str !== "product_price";
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-7 flex-row   ">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="md:text-2xl text-xl">Transactions</CardTitle>
          <CardDescription>View your transaction history.</CardDescription>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={
                  (table.getColumn("type")?.getFilterValue() as string) ?? ""
                }
                onValueChange={(v) => {
                  table.getColumn("type")?.setFilterValue(v);
                }}
              >
                <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="subscription">
                  subscription
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="top-up">
                  top-up
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <CSVLink
            data={cleanTransactions ?? []}
            filename={"my-file.csv"}
            onClick={handleClick}
          >
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </CSVLink>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={`${hideit(header.id) ? "hidden md:table-cell " : ""}`}
                      >
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
                    className={`cursor-pointer hover:bg-accent 

${activeLocation === (row.original as Transaction).id ? "bg-accent" : ""}
`}
                    onClick={() => navigate((row.original as Transaction).id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`${hideit(cell.column.id) ? "hidden md:table-cell " : ""}`}
                      >
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
                    No transaction have been made yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
