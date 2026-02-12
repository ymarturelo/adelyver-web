import { z } from "zod";
const statusOption = [
  "pending_review",
  "confirmed",
  "waiting_for_payment",
  "ready_for_pickup",
  "delivered",
  "cancelled",
] as const;

export const orderEditFormSchema = z.object({
  status: z.enum(statusOption, "Selecciona un estado para el pedido"),
  packagePrice: z
    .transform(Number)
    .pipe(z.number("Debe ser un número").min(0, "No puede ser negativo")),

  shippingPrice: z
    .transform(Number)
    .pipe(z.number("Debe ser un número").min(0, "No puede ser negativo")),

  investedMoney: z
    .transform(Number)
    .pipe(z.number("Debe ser un número").min(0, "No puede ser negativo")),

  amountPaidByClient: z
    .transform(Number)
    .pipe(z.number("Debe ser un número").min(0, "No puede ser negativo")),
});
export type OrderEditFormData = z.infer<typeof orderEditFormSchema>;
