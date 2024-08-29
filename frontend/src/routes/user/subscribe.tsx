import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
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

type PaymentType = "onetime" | "top-up" | "prepaid";

export const SubscribeView = () => {
  const { paymentContext } = useParams<"paymentContext">();
  const { data: plans } = useSuspenseQuery(userProductsQuery());

  const [contractDuration, setContractDuration] = useState(1);
  const [paymentType, setPaymentType] = useState<PaymentType>(() => {
    if (paymentContext === "top-up") return "top-up";
    if (paymentContext === "prepaid") return "prepaid";
    return "onetime";
  });

  if (!paymentContext) {
    return <Navigate to="/dashboard" />;
  }

  const onClose = () => {
    console.log("failure");
  };

  const onSwitch = (value: PaymentType) => {
    setPaymentType(value);
    setContractDuration(1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">
            {paymentType === "top-up"
              ? "Top-Up"
              : paymentContext === "onetime"
                ? "Subscription"
                : "Prepaid"}{" "}
            Plans
          </h1>
          <p className="text-muted-foreground">
            {paymentType === "onetime"
              ? "Choose the plan that best fits your needs."
              : paymentType === "top-up"
                ? "Upgrade your current plan for better service."
                : "Pay for your next subscription in advance."}
          </p>
        </div>
        <div className="flex md:flex-row-reverse flex-col gap-4">
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Label htmlFor="payment-frequency">Payment Type:</Label>
            <Select
              defaultValue="onetime"
              disabled={paymentContext === "onetime"}
              value={paymentType}
              onValueChange={onSwitch}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {paymentContext === "top-up" ? (
                  <>
                    <SelectItem value="top-up">Top-Up</SelectItem>
                    <SelectItem value="prepaid">Prepaid</SelectItem>
                  </>
                ) : (
                  <SelectItem value="onetime">One-Time</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          {paymentType !== "top-up" && (
            <div className="flex items-center gap-2">
              <Label htmlFor="payment-months">Months:</Label>
              <Slider
                id="payment-months"
                defaultValue={[1]}
                min={1}
                max={24}
                step={1}
                value={[contractDuration]}
                onValueChange={(value) => setContractDuration(value[0])}
                className="w-32"
              />
              <span>{contractDuration} months</span>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <SubsribeCard
            key={plan.id}
            type={paymentType}
            duration={contractDuration}
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
  duration: number;
  type: PaymentType;
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
  duration,
  type,
  onClose,
}: SubscribeCardProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const initializePayment = usePaystackPayment({
    publicKey: PAYSTACK_PUBLIC_KEY,
  });

  const upgradeTax = 0.3;
  const basePrice = plan.price * duration;
  const price =
    type !== "top-up" ? basePrice : basePrice + plan.price * upgradeTax;
  const systemPrice = price * 100;

  const onSuccess = (reference: TransactionInfo) => {
    try {
      trscService
        .createTransaction({
          productID: plan.id,
          reference: reference.reference,
          trxRef: reference.trxref,
          duration,
          finalPrice: price,
          type,
        })
        .then(() => {
          toast.success("Operation succeeded");
          queryClient.invalidateQueries({
            queryKey: ["user", "transactions"],
          });
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
                amount: systemPrice,
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
