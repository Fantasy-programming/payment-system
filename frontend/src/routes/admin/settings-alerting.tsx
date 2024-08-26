import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { adminPrefQuery } from "@/queries/adminQueries";
import {
  AdminAlertingRequest,
  adminAlertingRequestSchema,
} from "@/services/preference.types";
import preferenceService from "@/services/preference";

export const AdminAlertingSettings = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: preferences } = useSuspenseQuery(adminPrefQuery());

  const form = useForm({
    resolver: zodResolver(adminAlertingRequestSchema),
    defaultValues: {
      emailAlerts: preferences.emailAlerts,
      smsAlerts: preferences.smsAlerts,
      leaveAlertEmail: preferences.leaveAlertEmail,
      problemAlertEmail: preferences.problemAlertEmail,
      activationAlertEmail: preferences.activationAlertEmail,
      leaveAlertPhone: preferences.leaveAlertPhone,
      problemAlertPhone: preferences.problemAlertPhone,
      activationAlertPhone: preferences.activationAlertPhone,
      leaveAlert: preferences.leaveAlert,
      problemAlert: preferences.problemAlert,
      activationAlert: preferences.activationAlert,
    },
  });

  const onSubmit = async (data: AdminAlertingRequest) => {
    setLoading(true);
    try {
      await preferenceService.updateAdminPrefs(data);
      await queryClient.invalidateQueries({
        queryKey: ["admin", "preferences"],
      });
      toast.success("Admin preferences updated successfully.");
    } catch (error) {
      toast.error("Error updating admin preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Alert Preferences</CardTitle>
          <CardDescription>
            Configure how you receive administrative alerts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="general">
                <TabsList>
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <FormField
                    control={form.control}
                    name="emailAlerts"
                    render={({ field }) => (
                      <FormItem className="flex my-3 flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Alerts
                          </FormLabel>
                          <FormDescription>
                            Receive alerts via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="smsAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            SMS Alerts
                          </FormLabel>
                          <FormDescription>
                            Receive alerts via SMS
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="email">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="leaveAlertEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leave Alert Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Email for leave alerts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="problemAlertEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem Alert Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Email for problem alerts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="activationAlertEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activation Alert Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Email for activation alerts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="sms">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="leaveAlertPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leave Alert Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormDescription>
                            Phone number for leave alerts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="problemAlertPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Problem Alert Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormDescription>
                            Phone number for problem alerts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="activationAlertPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activation Alert Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormDescription>
                            Phone number for activation alerts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />{" "}
                  </div>
                </TabsContent>
              </Tabs>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="leaveAlert"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Leave Alerts</FormLabel>
                        <FormDescription>
                          Receive alerts for leave requests
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="problemAlert"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Problem Alerts</FormLabel>
                        <FormDescription>
                          Receive alerts for system problems
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activationAlert"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Activation Alerts</FormLabel>
                        <FormDescription>
                          Receive alerts for new account activations
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
