import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import userService from "@/services/user";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/passinput";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { userInfoQuery } from "@/queries/userQueries";
import {
  UserPersonalUpdate,
  userPersonalUpdateSchema,
} from "@/services/user.types";

// const personalInfoSchema = z
//   .object({
//     email: z.string().email("Invalid email address"),
//     phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
//     password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .optional(),
//     confirmPassword: z.string().optional(),
//   })
//   .refine(
//     (data) => {
//       if (data.password || data.confirmPassword) {
//         return data.password === data.confirmPassword;
//       }
//       return true;
//     },
//     {
//       message: "Passwords do not match",
//       path: ["confirmPassword"],
//     },
//   );

export const AdminGeneralSetting = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { data: info } = useSuspenseQuery(userInfoQuery());

  const form = useForm<UserPersonalUpdate>({
    resolver: zodResolver(userPersonalUpdateSchema),
    defaultValues: {
      email: info?.email || "",
      phone: info?.phone || "",
    },
  });

  const handleSubmit = async (data: UserPersonalUpdate) => {
    setLoading(true);
    try {
      await userService.updateProfile(data);
      await queryClient.invalidateQueries({
        queryKey: ["user", "me"],
      });
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your email, phone number, or password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the email address associated with your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="0123456789" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the phone number associated with your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank if you don't want to change your password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          disabled={loading}
          onClick={form.handleSubmit(handleSubmit)}
        >
          {loading ? "Updating..." : "Update Information"}
        </Button>
      </CardFooter>
    </Card>
  );
};
