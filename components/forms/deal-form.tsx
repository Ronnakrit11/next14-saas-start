"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { dealFormSchema, type DealFormValues } from "@/lib/validations/deal";
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

interface DealFormProps {
  onSuccess?: () => void;
  projectId: string;
}

export function DealForm({ onSuccess, projectId }: DealFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: "",
      price: "",
      status: "PENDING", // Force PENDING status for new deals
    },
  });

  async function onSubmit(data: DealFormValues) {
    setIsLoading(true);

    try {
      // Force status to PENDING for new deals
      const formData = {
        ...data,
        status: "PENDING",
        projectId: projectId
      };

      const response = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create deal");
      }

      toast.success("Deal created successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating deal:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>บริการ/สินค้า</FormLabel>
              <FormControl>
                <Input placeholder="Enter service or product name" {...field} />
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
              <FormLabel>ราคา</FormLabel>
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

        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          )}
          Create Deal
        </Button>
      </form>
    </Form>
  );
}