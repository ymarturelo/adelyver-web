import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

    email: z.email("Correo electrónico inválido"),

    phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),

    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Las contraseñas no coinciden",
        code: "custom",
      });
    }
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
