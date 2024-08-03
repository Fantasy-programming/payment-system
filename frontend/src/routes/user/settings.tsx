import { useForm } from "react-hook-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { usePrefQuery, userInfoQuery } from "@/queries/userQueries";

import userService from "@/services/user";

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { PasswordInput } from "@/components/ui/passinput";

import {
  UserPersonalUpdate,
  userPersonalUpdateSchema,
} from "@/services/user.types";
import {
  UserAlertingRequest,
  userAlertingRequestSchema,
} from "@/services/preference.types";
import { useState } from "react";
import { toast } from "sonner";
import preferenceService from "@/services/preference";
import { LoadingButton } from "@/components/ui/loading-button";

export const SettingsView = () => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data: info } = useSuspenseQuery(userInfoQuery());
  const { data: preferences } = useSuspenseQuery(usePrefQuery());

  const onGeneralSubmit = async (data: UserPersonalUpdate) => {
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

  const onAlertingSubmit = async (data: UserAlertingRequest) => {
    setLoading(true);
    try {
      await preferenceService.updatePrefs(data);
      await queryClient.invalidateQueries({
        queryKey: ["user", "preferences"],
      });
      toast.success("Alerting settings updated successfully.");
    } catch {
      toast.error("Error updating alerting settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <Card className="w-full">
          <CardHeader className="px-7">
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your account and application settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="alerting">Alerting</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <GeneralSettingsForm
                  initialData={{ email: info?.email, phone: info?.phone }}
                  onSubmit={onGeneralSubmit}
                  loading={loading}
                />
              </TabsContent>
              <TabsContent value="alerting">
                <AlertingSettingsForm
                  initialData={{
                    emailAlerts: preferences.emailAlerts,
                    smsAlerts: preferences.smsAlerts,
                    subscriptionAlert: preferences.subscriptionAlert,
                    productAlert: preferences.productAlert,
                    receiptEmail: preferences.receiptEmail,
                  }}
                  onSubmit={onAlertingSubmit}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

interface GeneralSettingsFormProps {
  initialData: {
    email: string;
    phone: string;
  };
  onSubmit: (data: UserPersonalUpdate) => Promise<void>;
  loading: boolean;
}

export const GeneralSettingsForm: React.FC<GeneralSettingsFormProps> = ({
  initialData,
  onSubmit,
  loading,
}) => {
  const form = useForm<UserPersonalUpdate>({
    resolver: zodResolver(userPersonalUpdateSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
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
                <Input type="text" placeholder="0596030559" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormDescription>
                Change your password to secure your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={loading} disabled={loading} type="submit">
          Save Changes
        </LoadingButton>
      </form>
    </Form>
  );
};

interface AlertingSettingsFormProps {
  initialData: UserAlertingRequest;
  onSubmit: (data: UserAlertingRequest) => Promise<void>;
  loading: boolean;
}

export const AlertingSettingsForm: React.FC<AlertingSettingsFormProps> = ({
  initialData,
  onSubmit,
  loading,
}) => {
  const form = useForm<UserAlertingRequest>({
    resolver: zodResolver(userAlertingRequestSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg font-medium">Medium</h3>
          <p className="text-sm text-muted-foreground">
            Configure how you receive notifications.
          </p>
        </div>
        <div
          data-orientation="horizontal"
          role="none"
          className="shrink-0 bg-border h-[1px] w-full"
        ></div>

        <FormField
          control={form.control}
          name="emailAlerts"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Email Alerts</FormLabel>
                <FormDescription>Receive alerts via email</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="smsAlerts"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>SMS Alerts</FormLabel>
                <FormDescription>Receive alerts via SMS</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
        </div>
        <FormField
          control={form.control}
          name="subscriptionAlert"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Subscription alerts</FormLabel>
                <FormDescription>
                  Receive alerts before my subscription ends
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
          name="productAlert"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Product alerts</FormLabel>
                <FormDescription>
                  Receive alerts about new products, price changes, and more
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
          name="receiptEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Receipt emails</FormLabel>
                <FormDescription>
                  Receive emails with your transaction receipts on each
                  transactions
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
        <LoadingButton loading={loading} disabled={loading} type="submit">
          Update preferences
        </LoadingButton>
      </form>
    </Form>
  );
};
