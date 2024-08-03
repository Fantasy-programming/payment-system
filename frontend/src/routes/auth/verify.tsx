import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

import authservice from "@/services/auth";
import { handleError } from "@/lib/utils";

import { LoadingButton } from "@/components/ui/loading-button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";

interface VerifyProps {
  type: "phone" | "email";
  value: string;
}

const FormSchema = z.object({
  token: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export const Verify = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { storeUser } = useAuth();

  const { type, value } = location.state as VerifyProps;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      token: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setSubmitting(true);
      const response = await authservice.verify(data.token, type, value);
      storeUser(response);
      setSubmitting(false);
      navigate("/dashboard");
    } catch (error) {
      const err = handleError(error);
      toast.error(err);
      setSubmitting(false);
    }
  }

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <CardTitle className="text-2xl px-6 py-4 text-center ">
              OTP
            </CardTitle>

            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center text-center gap-4 space-y-1">
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      {`Please enter the one-time token sent to your ${type}`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <LoadingButton
                type="submit"
                loading={isSubmitting}
                className="w-full"
              >
                {" "}
                Sign in{" "}
              </LoadingButton>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
};
