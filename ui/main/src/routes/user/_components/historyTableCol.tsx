import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/services/transaction.types";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "trxRef",
    header: "ID",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.trxRef}</span>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      return <span>{row.original.startDate.split("T")[0]}</span>;
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      return <span>{row.original.endDate.split("T")[0]}</span>;
    },
  },
  {
    accessorKey: "finalPrice",
    header: "Amount",
    cell: ({ row }) => {
      return <span>₵{row.original.product.price.toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "product.name",
    header: "Plan",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
];
