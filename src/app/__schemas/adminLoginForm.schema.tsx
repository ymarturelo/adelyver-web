import { email, z } from "zod";

export const adminLoginFormSchema = z.object({
  email: z.email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
export type AdiminLoginFormData = z.infer<typeof adminLoginFormSchema>;
