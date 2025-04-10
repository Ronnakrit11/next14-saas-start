import * as z from "zod";

export const dealFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }).refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a valid number",
  }),
  role: z.enum(["BUYER", "SELLER"]).optional(),
  status: z.enum(["PENDING", "PAID"]).optional(),
});

export type DealFormValues = z.infer<typeof dealFormSchema>;