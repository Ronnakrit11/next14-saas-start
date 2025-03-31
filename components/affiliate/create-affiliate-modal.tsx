"use client";

import { Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Modal } from "@/components/ui/modal";
import { affiliateFormSchema, type AffiliateFormValues } from "@/lib/validations/affiliate";
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

interface CreateAffiliateModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export function CreateAffiliateModal({ showModal, setShowModal }: CreateAffiliateModalProps) {
  const form = useForm<AffiliateFormValues>({
    resolver: zodResolver(affiliateFormSchema),
    defaultValues: {
      name: "",
      email: "",
      commission: "",
    },
  });

  const onSubmit = async (data: AffiliateFormValues) => {
    try {
      // TODO: Implement affiliate user creation
      console.log("Form data:", data);
      toast.success("Affiliate user created successfully!");
      setShowModal(false);
      form.reset();
    } catch (error) {
      console.error("Error creating affiliate:", error);
      toast.error("Failed to create affiliate user");
    }
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <h3 className="font-urban text-2xl font-bold">Add New Affiliate</h3>
          <p className="text-sm text-muted-foreground">
            Add a new affiliate user to your project
          </p>
        </div>

        <div className="px-4 py-8 md:px-16">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter affiliate name" {...field} />
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
                      <Input 
                        type="email"
                        placeholder="Enter affiliate email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

         

              <Button type="submit" className="w-full">
                {form.formState.isSubmitting && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                Create Affiliate
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}