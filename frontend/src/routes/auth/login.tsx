import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

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

const emailSchema = z.object({
  email: z.string().min(1, "Enter a valid email address").email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
    ),
});

const phoneSchema = z.object({
  phone: z.string().length(10, "Phone must have 10 digits"),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
export type PhoneFormValues = z.infer<typeof phoneSchema>;

function EmailLoginForm({
  onSubmit,
}: {
  onSubmit: SubmitHandler<EmailFormValues>;
}) {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
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
                  <Input
                    placeholder="enter password "
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}

function PhoneLoginForm({
  onSubmit,
}: {
  onSubmit: SubmitHandler<PhoneFormValues>;
}) {
  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
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
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}

export function Login() {
  const [activeTab, setActiveTab] = useState<"user" | "admin">("user");
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const { storeUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    if (value === "user" || value === "admin") {
      setActiveTab(value);
    }
  };

  const onSubmitEmail: SubmitHandler<EmailFormValues> = async (values) => {
    try {
      const response = await authservice.login(values);
      storeUser(response);
      navigate("/dashboard");
    } catch (error) {
      const err = handleError(error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err,
      });
    }
  };

  const onSubmitPhone: SubmitHandler<PhoneFormValues> = async (values) => {
    try {
      await authservice.mobileLogin(values);
      navigate("/verify", { state: { type: "phone", value: values.phone } });
    } catch (error) {
      const err = handleError(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err,
      });
    }
  };

  return (
    <div className="w-full lg:grid min-h-screen lg:grid-cols-2 overflow-y-hidden">
      <div className="flex h-screen items-center justify-center py-12">
        <div className="mx-auto grid w-[330px] sm:w-[400px] gap-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">Login as User</TabsTrigger>
              <TabsTrigger value="admin">Login as Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              {loginType === "email" ? (
                <EmailLoginForm onSubmit={onSubmitEmail} />
              ) : (
                <PhoneLoginForm onSubmit={onSubmitPhone} />
              )}
            </TabsContent>
            <TabsContent value="admin">
              {loginType === "email" ? (
                <EmailLoginForm onSubmit={onSubmitEmail} />
              ) : (
                <PhoneLoginForm onSubmit={onSubmitPhone} />
              )}
            </TabsContent>
          </Tabs>
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
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden max-h-screen bg-muted lg:block overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1692927406364-fef8bba6ec86?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
