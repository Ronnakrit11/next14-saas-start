"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { productFormSchema, type ProductFormValues } from "@/lib/validations/product";
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
import { Icons } from "@/components/shared/icons";

interface ProductFormProps {
  onSuccess?: () => void;
  projectId: string;
}

export function ProductForm({ onSuccess, projectId }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      price: "",
      commission: "",
    },
  });

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);

    try {
      const formData = {
        ...data,
        price: parseFloat(data.price),
        commission: parseFloat(data.commission),
        projectId: projectId
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create product");
      }

      toast.success("Product created successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="commission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Commission</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter commission"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          )}
          Create Product
        </Button>
      </form>
    </Form>
  );
}