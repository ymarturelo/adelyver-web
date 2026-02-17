import * as z from "zod";

export const productFormValuesSchema = z.object({
  trackingNumber: z.string().min(1, "El número de seguimiento es obligatorio"),

  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

  idFromShop: z
    .string()
    .min(1, "El ID es obligatorio")
    .regex(/^\d+$/, "El ID debe ser un valor numérico"),

  url: z.url("Debe ser una URL válida").min(1, "El enlace es obligatorio"),
});

export type ProductFormValues = z.infer<typeof productFormValuesSchema>;
