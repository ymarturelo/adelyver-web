import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Correo inválido")
    .or(z.string().regex(/^[0-9]{8,11}$/, "Número de teléfono inválido")),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
export type LoginData = z.infer<typeof loginSchema>;
