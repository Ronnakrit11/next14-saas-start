import * as z from "zod";

export const affiliateFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  commission: z.string().min(1, {
    message: "Commission rate is required.",
  }).refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, {
    message: "Commission must be between 0 and 100.",
  }),
});

export type AffiliateFormValues = z.infer<typeof affiliateFormSchema>;