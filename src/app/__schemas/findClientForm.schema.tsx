import { z } from "zod";

export const findClientFormSchema = z.object({
  name: z.string(),

  phone: z.string().regex(/^[0-9]*$/, "El teléfono solo debe contener números"),
});
export type FindClientFormData = z.infer<typeof findClientFormSchema>;
