import { Transaction } from "@/services/transaction.types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { MetaProps } from "./orders-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFReceipt from "@/components/pdf/PDFReceipt";
import { Receipt } from "@/components/ui/receipt";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user.lastName",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <span>
          {user.firstName} {user.lastName}
        </span>
      );
    },
  },
  {
    id: "email",
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "user.phone",
    header: "Phone",
  },
  {
    accessorKey: "user.routerID",
    header: "Router ID",
  },
  {
    accessorKey: "product.name",
    header: "Plan",
  },
  {
    accessorKey: "createdAt",
    header: "Payment Date",
    cell: ({ row }) => {
      const time = row.original.createdAt;
      return <span>{new Date(time).toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const payment = row.original;
      const goto = (table.options.meta as MetaProps)?.gotoPage;
      const deleteTransaction = (table.options.meta as MetaProps)
        ?.deleteTransaction;

      return (
        <Sheet>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <PDFDownloadLink
                document={<PDFReceipt orderData={payment} />}
                fileName={`receipt-${payment.trxRef}.pdf`}
              >
                <DropdownMenuItem>Download Receipt</DropdownMenuItem>
              </PDFDownloadLink>
              <DropdownMenuSeparator />
              <SheetTrigger asChild>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
              </SheetTrigger>
              <DropdownMenuItem
                onClick={() => goto(`/admin/customers/${payment.user.id}`)}
              >
                View customer details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteTransaction(payment.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SheetContent>
            <VisuallyHidden.Root>
              <SheetHeader>
                <SheetTitle>Transaction Details</SheetTitle>
                <SheetDescription>
                  See the details of the current transaction
                </SheetDescription>
              </SheetHeader>
            </VisuallyHidden.Root>
            <Receipt mode="compact" transaction={payment} className="text-sm" />
          </SheetContent>
        </Sheet>
      );
    },
  },
];
