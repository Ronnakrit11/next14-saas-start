import * as z from "zod";

export const productFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }).refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a valid number",
  }),
  commission: z.string().min(1, {
    message: "Commission is required.",
  }).refine((val) => !isNaN(parseFloat(val)), {
    message: "Commission must be a valid number",
  }),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;