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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Deal {
  id: string;
  title: string;
  price: number;
  status: "PENDING" | "PAID";
  createdAt: string;
}

interface EditDealFormProps {
  deal: Deal;
  onSuccess: (deal: Deal) => void;
}

export function EditDealForm({ deal, onSuccess }: EditDealFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: deal.title,
      price: deal.price.toString(),
      status: deal.status,
    },
  });

  async function onSubmit(data: DealFormValues) {
    // Prevent editing if deal is already paid
    if (deal.status === "PAID") {
      toast.error("Cannot edit a paid deal");
      return;
    }

    // Prevent changing status to PAID
    if (data.status === "PAID") {
      toast.error("Status cannot be changed to PAID manually");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: "PENDING", // Force status to remain PENDING
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update deal");
      }

      onSuccess(responseData.deal);
    } catch (error) {
      console.error("Error updating deal:", error);
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter title" 
                  {...field} 
                  disabled={deal.status === "PAID"}
                />
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
                  disabled={deal.status === "PAID"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={true} // Always disable status selection
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID" disabled>Paid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading || deal.status === "PAID"}>
          {isLoading && (
            <Icons.spinner className="mr-2 size-4 animate-spin" />
          )}
          {deal.status === "PAID" ? "Cannot Edit Paid Deal" : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}