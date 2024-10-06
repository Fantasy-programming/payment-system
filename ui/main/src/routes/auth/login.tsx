import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passinput";

import authservice from "@/services/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Phone } from "lucide-react";
import { handleError } from "@/lib/utils";
import {
  EmailFormValues,
  emailLoginSchema,
  PhoneFormValues,
  phoneLoginSchema,
} from "@/services/auth.types";

function EmailLoginForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: SubmitHandler<EmailFormValues>;
  isSubmitting: boolean;
}) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="me@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton type="submit" loading={isSubmitting} className="w-full">
          {" "}
          Login{" "}
        </LoadingButton>
      </form>
    </Form>
  );
}

function PhoneLoginForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: SubmitHandler<PhoneFormValues>;
  isSubmitting: boolean;
}) {
  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneLoginSchema),
    defaultValues: {
      phone: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="type number here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton type="submit" loading={isSubmitting} className="w-full">
          Login
        </LoadingButton>
      </form>
    </Form>
  );
}

export function Login() {
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [isSubmitting, setSubmitting] = useState(false);
  const { storeUser } = useAuth();
  const navigate = useNavigate();

  const onSubmitEmail: SubmitHandler<EmailFormValues> = async (values) => {
    try {
      setSubmitting(true);
      const response = await authservice.emaillogin(values);
      storeUser(response);
      setSubmitting(false);
      navigate("/dashboard");
    } catch (error) {
      const err = handleError(error);
      toast.error(err);
      setSubmitting(false);
    }
  };

  const onSubmitPhone: SubmitHandler<PhoneFormValues> = async (values) => {
    try {
      setSubmitting(true);
      await authservice.mobileLogin(values);
      setSubmitting(false);
      navigate("/verify", { state: { type: "phone", value: values.phone } });
    } catch (error) {
      setSubmitting(false);
      const err = handleError(error);
      toast.error(err);
    }
  };

  return (
    <div className="w-full lg:grid min-h-screen lg:grid-cols-2 overflow-y-hidden">
      <div className="flex h-screen items-center justify-center py-12">
        <div className="mx-auto grid w-[330px] sm:w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your {loginType === "email" ? "email" : "phone"} below to
              login to your account
            </p>
          </div>

          {loginType === "email" ? (
            <EmailLoginForm
              onSubmit={onSubmitEmail}
              isSubmitting={isSubmitting}
            />
          ) : (
            <PhoneLoginForm
              onSubmit={onSubmitPhone}
              isSubmitting={isSubmitting}
            />
          )}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() =>
              setLoginType((v) => (v === "email" ? "phone" : "email"))
            }
          >
            {loginType === "email" ? (
              <>
                <Phone className="h4 w-4" />
                Login with Phone
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Login with Email
              </>
            )}
          </Button>
          <div className="mt-4 text-center text-sm">
            Forgot your password & lost your phone? Contact support to recover
            it
          </div>
        </div>
      </div>
      <div className="hidden max-h-screen bg-muted lg:block overflow-hidden">
        <img
          src="/hero.webp"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
