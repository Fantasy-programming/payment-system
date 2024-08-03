import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePaystackPayment } from "react-paystack";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import { PAYSTACK_PUBLIC_KEY } from "@/lib/config";
import { userProductsQuery } from "@/queries/userQueries";
import trscService from "@/services/transaction";
import { handleError } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Product } from "@/services/product.types";

interface SubscribeViewProps {
  type: "subscription" | "top-up";
}

type PaymentFrequency = "onetime" | "monthly";

export const SubscribeView = ({ type }: SubscribeViewProps) => {
  const [paymentFrequency, setPaymentFrequency] =
    useState<PaymentFrequency>("onetime");
  const [paymentMonths, setPaymentMonths] = useState(1);

  const { data: plans } = useSuspenseQuery(userProductsQuery());

  const onClose = () => {
    console.log("failure");
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            {type === "top-up" ? "Top-Up" : "Subscription"} Plans
          </h1>
          <p className="text-muted-foreground">
            Choose the plan that best fits your needs.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Label htmlFor="payment-frequency">Payment Frequency:</Label>
            <Select
              defaultValue="onetime"
              value={paymentFrequency}
              onValueChange={(value: PaymentFrequency) =>
                setPaymentFrequency(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onetime">One-Time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {paymentFrequency === "onetime" && (
            <div className="flex items-center gap-2">
              <Label htmlFor="payment-months">Months:</Label>
              <Slider
                id="payment-months"
                defaultValue={[1]}
                min={1}
                max={24}
                step={1}
                value={[paymentMonths]}
                onValueChange={(value) => setPaymentMonths(value[0])}
                className="w-32"
              />
              <span>{paymentMonths} months</span>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <SubsribeCard
            key={plan.id}
            type={type}
            frequency={paymentFrequency}
            months={paymentMonths}
            plan={plan}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};

interface SubscribeCardProps {
  plan: Product;
  frequency: PaymentFrequency;
  months: number;
  type: "subscription" | "top-up";
  onClose: () => void;
}

interface TransactionInfo {
  message: string;
  redirecturl: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

const SubsribeCard = ({
  plan,
  months,
  type,
  frequency,
  onClose,
}: SubscribeCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const initializePayment = usePaystackPayment({
    publicKey: PAYSTACK_PUBLIC_KEY,
  });

  const recurring = frequency === "monthly" ? true : false;
  const upgradeTax = type === "subscription" ? 0 : 0.3;
  const price = !recurring
    ? plan.price * months + plan.price * upgradeTax
    : plan.price + plan.price * upgradeTax;
  const finalPrice = price * 100;

  const onSuccess = (reference: TransactionInfo) => {
    try {
      trscService
        .createTransaction({
          productID: plan.id,
          reference: reference.reference,
          trxRef: reference.trxref,
          months: months,
          finalPrice: price,
          type: type,
          recurring: recurring,
        })
        .then(() => {
          toast.success("Operation succeeded");
          navigate("/dashboard");
        });
    } catch (error) {
      const err = handleError(error);
      toast.error(err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>₵{price}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-muted-foreground">
          {plan.rate && (
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
              {plan.rate} mbs
            </li>
          )}
          {plan.hasCap && (
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
              {plan.cap} GB Cap
            </li>
          )}
          {plan.capDownTo && (
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
              Downgrade to {plan.capDownTo} mbs
            </li>
          )}
          {!plan.hasPublicIp ? (
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4 text-red-500" />
              No Public IP
            </li>
          ) : (
            <li>
              <CheckIcon className="mr-2 inline-block h-4 w-4 text-green-500" />
              Public IP
            </li>
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() =>
            initializePayment({
              onSuccess,
              onClose,
              config: {
                reference: new Date().getTime().toString(),
                email: user.email,
                amount: finalPrice,
                currency: "GHS",
              },
            })
          }
        >
          Choose Plan
        </Button>
      </CardFooter>
    </Card>
  );
};
