import { z } from "zod";

export const createUserSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

    gmail: z.email("Correo electrónico inválido"),

    phone: z
      .string()
      .min(8, "El teléfono debe tener al menos 8 dígitos")
      .regex(/^[0-9]+$/, "El teléfono solo debe contener números"),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),

    confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type CreateUserFormData = z.infer<typeof createUserSchema>;
