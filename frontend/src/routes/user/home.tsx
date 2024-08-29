import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { differenceInDays, isAfter, isBefore, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { userInfoQuery, userTransactionsQuery } from "@/queries/userQueries";
import { RequestTransferModal } from "./_components/RequetTransfertModal";
import RequestSupportModal from "./_components/RequestSupportModal";
import { Transaction } from "@/services/transaction.types";

export const UserHomeView = () => {
  const { data: user } = useSuspenseQuery(userInfoQuery());
  const { data: transactions } = useSuspenseQuery(userTransactionsQuery());

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [percentagePassed, setPercentagePassed] = useState<number>(0);
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [mostRecentTransaction, setMostRecentTransaction] =
    useState<Transaction>(transactions[0] ?? []);

  const navigate = useNavigate();

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      let mostRecentTransaction = transactions[0];

      if (
        mostRecentTransaction.type === "prepaid" &&
        isAfter(parseISO(mostRecentTransaction.startDate), new Date())
      ) {
        mostRecentTransaction = transactions[1];
      }

      const endDate = parseISO(mostRecentTransaction.endDate);
      const startDate = parseISO(mostRecentTransaction.startDate);
      const currentDate = new Date();

      if (isBefore(endDate, currentDate)) {
        return setIsSubscribed(false);
      }

      const totalDays = differenceInDays(endDate, startDate);
      const daysPassed = differenceInDays(currentDate, startDate);
      const daysLeft = differenceInDays(endDate, currentDate);

      const percentage = Math.max(
        0,
        Math.min(100, (daysPassed / totalDays) * 100),
      );

      setIsSubscribed(true);
      setPercentagePassed(percentage);
      setMostRecentTransaction(mostRecentTransaction);
      setDaysLeft(daysLeft);
    }
  }, [transactions]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>
                {isSubscribed ? "Top-Up Subscription" : "Subscribe Now"}
              </CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Mikronet is a leading isp with a wide range of services.
                Subscribe now to enjoy our services.
              </CardDescription>
            </CardHeader>
            <CardFooter className="gap-2">
              <Button
                onClick={() =>
                  navigate(
                    isSubscribed
                      ? "/dashboard/subscribe/top-up"
                      : "/dashboard/subscribe/onetime",
                  )
                }
              >
                {isSubscribed ? "Top-Up Subscription" : "Subscribe Now"}
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current Plan</CardDescription>
              <CardTitle className="text-4xl">
                {transactions ? (
                  isSubscribed ? (
                    mostRecentTransaction?.product.name
                  ) : (
                    "No Plan"
                  )
                ) : (
                  <Skeleton className="h-5" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                {daysLeft} Days left before end
              </div>
            </CardContent>
            <CardFooter>
              <Progress
                value={percentagePassed}
                aria-label="${percentagePassed}% has passed"
              />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="pb-6 gap-y-5 items-center">
              <CardDescription>Data Rate</CardDescription>
              <CardTitle className="text-4xl">
                {transactions ? (
                  isSubscribed ? (
                    `${mostRecentTransaction?.product.rate} MBS`
                  ) : (
                    "No Plan"
                  )
                ) : (
                  <Skeleton className="h-5" />
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Those are your 5 most recent transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Plan</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions && transactions.length > 0 ? (
                    transactions.slice(-5).map((transaction) => (
                      <TableRow
                        className="hover:bg-accent"
                        key={transaction.id}
                      >
                        <TableCell>
                          <div className="font-medium">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {user?.email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {`${transaction?.duration} month`}{" "}
                          {transaction?.type === "onetime"
                            ? "subscription"
                            : transaction?.type}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {transaction?.product.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {transaction?.startDate.split("T")[0]}
                        </TableCell>
                        <TableCell className="text-right">
                          ₵{transaction?.finalPrice}
                        </TableCell>
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
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                Account
              </CardTitle>
              <CardDescription>
                Date: {user?.createdAt ? formatDate(user?.createdAt) : ""}
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <RequestTransferModal />
            </div>
          </CardHeader>
          <CardContent className="p-6 text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Customer Information</div>
              <dl className="grid gap-3">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">First Name</dt>
                  <dd>{user?.firstName}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Last Name</dt>
                  <dd>{user?.lastName}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a href={`mailto:${user?.email}`}>{user?.email}</a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>
                    <a href={`tel:${user?.phone}`}>{user?.phone}</a>
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Zone</dt>
                  <dd>{user?.zone}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Router ID</dt>
                  <dd>{user?.routerID}</dd>
                </div>
              </dl>
            </div>

            <Separator className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="font-semibold">Address</div>
                <address className="grid gap-0.5 not-italic text-muted-foreground">
                  {user?.address
                    .split(",")
                    .map((line, index) => <span key={index}>{line}</span>)}
                </address>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
            <div className="text-xs text-muted-foreground">
              Updated{" "}
              <time dateTime="2023-11-23">
                {user?.updatedAt ? formatDate(user?.updatedAt) : ""}
              </time>
            </div>
            <RequestSupportModal />
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};
