import { z } from "zod";

export const loginSchema = z
.object({
     email: z.email("Correo electrónico inválido").or(z.string().regex(
          /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
          "Debe ser un correo válido o un número de teléfono")
     ),
     password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
})
export type LoginData = z.infer<typeof loginSchema>;
