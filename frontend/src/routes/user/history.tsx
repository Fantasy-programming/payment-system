import { Badge } from "@/components/ui/badge";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";
import { File, ListFilter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { userTransactionsQuery } from "@/queries/userQueries";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export const HistoryView = () => {
  const {
    data: transactions,
    isLoading: isLoading,
    isError: isError,
  } = useQuery(userTransactionsQuery());

  const navigate = useNavigate();
  const location = useLocation();

  const activeLocation = location.pathname.split("/").filter(Boolean).pop();
  const cleanTransactions = transactions?.map((transaction) => ({
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

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card className="w-full">
          <CardHeader className="px-7 flex-row   ">
            <div className="flex flex-col space-y-1.5">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>View your transaction history.</CardDescription>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Subscription
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Top-Up</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CSVLink
                data={cleanTransactions ?? []}
                filename={"my-file.csv"}
                onClick={() => {
                  if (!transactions) return false;

                  if (transactions.length === 0) {
                    alert("nothing to export");
                    return false;
                  }

                  const response = confirm("Export data to csv ?");
                  return response;
                }}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1 text-sm"
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Export</span>
                </Button>
              </CSVLink>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <DetailedTableSkeleton />
            ) : isError ? (
              <div>Error</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions && transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        onClick={() => navigate(transaction.id)}
                        className={`cursor-pointer hover:bg-accent
                        ${activeLocation === transaction.id ? "bg-accent" : ""}
                        "`}
                      >
                        <TableCell className="font-medium">
                          {transaction.trxRef}
                        </TableCell>
                        <TableCell>
                          {transaction.startDate.split("T")[0]}
                        </TableCell>
                        <TableCell>
                          {transaction.endDate.split("T")[0]}{" "}
                        </TableCell>
                        <TableCell className="text-right">
                          ₵{transaction.product.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge>{transaction.product.name}</Badge>
                        </TableCell>
                        <TableCell>{transaction.type}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No transaction yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <Outlet />
      </div>
    </main>
  );
};

const DetailedTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Start Date</TableHead>
        <TableHead>End Date</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Plan</TableHead>
        <TableHead>Type</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[1, 2, 3, 4, 5].map((index) => (
        <TableRow key={index}>
          <TableCell className="font-medium">
            <Skeleton className="h-5 w-3/4 " />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-3/4 " />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-3/4 " />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-5 w-1/2 " />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-3/4 " />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-3/4 " />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
