import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import supportService from "@/services/support";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  ResponsiveModal,
  ResponsiveModalTrigger,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalClose,
} from "@/components/ui/responsive-modal";
import { useState } from "react";
import { toast } from "sonner";
import { TransferRequest, transferSchema } from "@/services/support.types";

export const RequestTransferModal = () => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      newAddress: "",
    },
  });

  const onSubmit = async (data: TransferRequest) => {
    const support = supportService.requestTransfer(data);

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
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <Truck className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            Request Transfer
          </span>
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle>
                Request Installation Transfer
              </ResponsiveModalTitle>
              <ResponsiveModalDescription>
                Are you moving to a new address? Please provide the new address
                for your router installation transfer.
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>
            <div className="py-4">
              <FormField
                control={form.control}
                name="newAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter new address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <ResponsiveModalFooter>
              <ResponsiveModalClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </ResponsiveModalClose>
              <Button type="submit">Submit Transfer Request</Button>
            </ResponsiveModalFooter>
          </form>
        </Form>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
