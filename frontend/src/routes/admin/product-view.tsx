import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { handleError } from "@/lib/utils";

import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useNavigate, useParams } from "react-router-dom";
import { ProductRequest, productRequestSchema } from "@/services/product.types";
import { toast } from "sonner";

import productServices from "@/services/product";
import { adminProductQuery } from "@/queries/adminQueries";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

export const SelectedProductView = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product } = useSuspenseQuery(adminProductQuery(id ?? ""));

  const [hasCap, setHasCap] = useState(product.hasCap);

  const form = useForm<ProductRequest>({
    resolver: zodResolver(productRequestSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      rate: product.rate,
      cap: product.cap,
      capDownTo: product.capDownTo,
      hasCap: product.hasCap,
      hasPublicIp: product.hasPublicIp,
      status: product.status,
    },
  });

  const onCapChange = (newState: boolean) => {
    setHasCap(newState);
    form.setValue("cap", undefined);
    form.setValue("capDownTo", undefined);
  };

  const onSubmit: SubmitHandler<ProductRequest> = async (values) => {
    try {
      setSubmitting(true);
      if (id) await productServices.updateProduct(id, values);
      await queryClient.invalidateQueries({
        queryKey: ["admin", "product", id],
      });
      setSubmitting(false);
      toast.success("Product updated successfully.");
    } catch (error) {
      const err = handleError(error);
      toast.error(err);
      setSubmitting(false);
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto grid max-w-[200rem] flex-1 auto-rows-max gap-4"
        >
          <div className="flex items-center gap-4 pt-6">
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="h-7 w-7"
              onClick={() => navigate("/admin/products")}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="destructiveOutline" size="sm">
                Delete
              </Button>
              <LoadingButton size="sm" type="submit" loading={isSubmitting}>
                Save Product
              </LoadingButton>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Enter the details of your product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                className="w-full"
                                placeholder="Enter product name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                className="min-h-32"
                                placeholder="Enter the product description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className="w-full"
                                placeholder="Enter price"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rate</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                className="w-full"
                                placeholder="Enter rate"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger
                                  id="status"
                                  aria-label="Select status"
                                >
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure cap and IP settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="hasCap"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Has Data Cap</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(state) => {
                                field.onChange(state);
                                onCapChange(state);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {hasCap && (
                      <>
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="cap"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Data Cap</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="w-full"
                                    placeholder="Enter Cap"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-3">
                          <FormField
                            control={form.control}
                            name="capDownTo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cap Down To</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    className="w-full"
                                    placeholder="Enter cap down to"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
                    <FormField
                      control={form.control}
                      name="hasPublicIp"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel>Has Public IP</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Archive Product</CardTitle>
                  <CardDescription>
                    Archive this product if it's no longer active.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" variant="secondary">
                    Archive Product
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm" type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </Form>
    </main>
  );
};
