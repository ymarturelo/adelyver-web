import { z } from "zod";

export const findClientFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .regex(/^[0-9]+$/, "El teléfono solo debe contener números"),
});
export type FindClientFormData = z.infer<typeof findClientFormSchema>;
