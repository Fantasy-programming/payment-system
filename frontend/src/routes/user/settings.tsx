import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const SettingsView = () => {
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
                <div className="grid gap-6 pt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Phone</Label>
                    <Input id="name" placeholder="Your name" />
                    <div className="text-sm text-muted-foreground">
                      This is the name that will be displayed on your profile.
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                    />
                    <div className="text-sm text-muted-foreground">
                      This is the email address associated with your account.
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                    <div className="text-sm text-muted-foreground">
                      Change your password to secure your account.
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="light">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                      Choose the theme for your dashboard.
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="alerting">
                <div className="grid gap-6 pt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="notifications">Notifications</Label>
                    <Select defaultValue="everything">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select notifications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everything">Everything</SelectItem>
                        <SelectItem value="mentions">Mentions</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground">
                      Choose what you want to be notified about.
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alert-channels">Alert Channels</Label>
                    <Checkbox id="alert-email" defaultChecked>
                      Email
                    </Checkbox>
                    <Checkbox id="alert-slack">Slack</Checkbox>
                    <Checkbox id="alert-sms">SMS</Checkbox>
                    <div className="text-sm text-muted-foreground">
                      Choose the channels you want to receive alerts on.
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SettingsView;
