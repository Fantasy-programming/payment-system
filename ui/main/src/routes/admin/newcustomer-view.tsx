import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { UserUpdate, userUpdateSchema } from "@/services/user.types";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { adminUserQuery } from "@/queries/adminQueries";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import userService from "@/services/user";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";

export const UserViewPage = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: user } = useSuspenseQuery(adminUserQuery(id ?? ""));

  const form = useForm<UserUpdate>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      zone: user?.zone,
      status: user?.status,
      address: user?.address,
      routerID: user?.routerID,
      createdAt: user?.createdAt,
      updatedAt: user?.updatedAt,
      role: user?.role,
      emailVerified: user?.emailVerified,
      phoneVerified: user?.phoneVerified,
    },
  });

  const onSubmit: SubmitHandler<UserUpdate> = async (data) => {
    try {
      setSubmitting(true);
      if (id) await userService.updateUser(id, data);
      setSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      navigate("/admin/customers");
      toast.success("User updated successfully.");
    } catch (e) {
      const error = handleError(e);
      setSubmitting(false);
      toast.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="h-7 w-7"
          onClick={() => navigate("/admin/customers")}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold ">Customer Info</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Enter the user's personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
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
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Set up the user's account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="zone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a zone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="zone1">Zone 1</SelectItem>
                          <SelectItem value="zone2">Zone 2</SelectItem>
                          <SelectItem value="zone3">Zone 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="routerID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Router ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end">
            <LoadingButton type="submit" loading={isSubmitting}>
              Update Info
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};
