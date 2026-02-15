import { z } from "zod";

export const orderFormSchema = z.object({
  url: z.url("Debe insertar una url válida"),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
