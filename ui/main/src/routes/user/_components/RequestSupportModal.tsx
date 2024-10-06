import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import supportService from "@/services/support";

import { PocketKnife, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  ResponsiveModal,
  ResponsiveModalTrigger,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalClose,
} from "@/components/ui/responsive-modal";
import { SupportRequest, supportSchema } from "@/services/support.types";
import { toast } from "sonner";
import { useState } from "react";

const RequestSupportModal = () => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: SupportRequest) => {
    const support = supportService.requestSupport(data);

    setOpen(false);

    toast.promise(support, {
      loading: "Sending Request...",
      success: () => {
        form.reset();
        return "Request sent successfully 👌";
      },
      error: "Error While sending request 🤯",
    });

    await support;
  };

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 ml-auto mr-0 gap-1">
          <PocketKnife className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            Request Support
          </span>
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>Request Support</ResponsiveModalTitle>
              <ResponsiveModalDescription>
                Please describe what went wrong, and we'll get back to you as
                soon as possible.
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>
            <div className="py-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What went wrong?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your issue here..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <ResponsiveModalFooter>
              <div className="w-full">
                <div className="w-full flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    Alternative contact methods:
                  </span>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="w-full flex justify-end gap-2">
                  <ResponsiveModalClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </ResponsiveModalClose>
                  <Button type="submit">Submit Support Request</Button>
                </div>
              </div>
            </ResponsiveModalFooter>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default RequestSupportModal;
