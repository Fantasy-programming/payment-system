import * as React from "react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCardIcon,
  Smartphone,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFReceipt from "@/components/pdf/PDFReceipt";

import { Transaction } from "@/services/transaction.types";

interface ReceiptProps extends React.HTMLAttributes<HTMLDivElement> {
  transaction: Transaction;
  mode: "compact" | "full";
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  ({ className, transaction, mode, ...props }, ref) => (
    <Card className={cn("overflow-hidden", className)} {...props} ref={ref}>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-sm md:text-lg ">
            <span className="truncate"> Order {transaction.trxRef}</span>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Date: {formatDate(transaction.startDate)}
          </CardDescription>
        </div>
        {mode === "full" && (
          <div className="ml-auto flex items-center gap-1">
            <PDFDownloadLink
              document={<PDFReceipt orderData={transaction} />}
              fileName={`receipt-${transaction.trxRef}.pdf`}
            >
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Truck className="h-3.5 w-3.5" />
                <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                  Export receipt
                </span>
              </Button>
            </PDFDownloadLink>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Order Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {transaction.product.name} data plan x{" "}
                <span>{transaction.duration} month</span>
              </span>
              <span>₵{transaction?.finalPrice?.toFixed(2)}</span>
            </li>
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₵{transaction.product?.price?.toFixed(2)}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>₵00.00</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>₵{transaction?.finalPrice?.toFixed(2)}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Address</div>
            <address className="grid gap-0.5 not-italic text-muted-foreground">
              {transaction.user.address
                ?.split(",")
                .map((line, index) => <span key={index}>{line}</span>)}
            </address>
          </div>
          <div className="grid auto-rows-max gap-3">
            <div className="font-semibold">Billing Information</div>
            <div className="text-muted-foreground">Same as home address</div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Customer Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Customer</dt>
              <dd>
                {transaction.user?.lastName} {transaction?.user?.firstName}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href={`mailto:${transaction?.user?.email}`}>
                  {transaction?.user?.email}
                </a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href={`tel:${transaction?.user?.phone}`}>
                  {transaction?.user?.phone}
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Payment Information</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                {transaction.medium === "Visa" ? (
                  <CreditCardIcon className="h-4 w-4" />
                ) : (
                  <Smartphone className="h-4 w-4" />
                )}

                {transaction?.medium}
              </dt>
              {transaction.medium === "Visa" ? (
                <dd>**** **** **** 4532</dd>
              ) : (
                <dd>{transaction?.user?.phone}</dd>
              )}
            </div>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated{" "}
          <time dateTime="2023-11-23">{formatDate(transaction.updatedAt)}</time>
        </div>
        {mode === "full" && (
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardFooter>
    </Card>
  ),
);

Receipt.displayName = "Receipt";
