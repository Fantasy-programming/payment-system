import { User } from "@/services/user.types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MetaProps } from "./customers-table";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "lastName",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage alt="Avatar" />
            <AvatarFallback>
              {user.firstName.at(0)?.toUpperCase()}
              {user.lastName.at(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>
            {user.firstName} {user.lastName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "routerID",
    header: "Router ID",
  },
  {
    accessorKey: "zone",
    header: "Zone",
  },
  {
    accessorKey: "createdAt",
    header: "Onboarding Date",
    cell: ({ row }) => {
      const time = row.original.createdAt;
      return <span>{new Date(time).toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const customer = row.original;
      const goto = (table.options.meta as MetaProps)?.gotoPage;
      const deleteCustomer = (table.options.meta as MetaProps)?.deleteCustomer;
      const resetPassword = (table.options.meta as MetaProps)?.resetPassword;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => goto(customer.id)}>
              View customer details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => resetPassword(customer.id)}>
              Reset password
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteCustomer(customer.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
