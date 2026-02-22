import { z } from "zod";

export const findOrdersFilterFormSchema = z
  .object({
    trackingNumber: z.string(),
    productId: z.string(),
    clientNumber: z
      .string()
      .regex(/^[0-9]*$/, "El teléfono solo debe contener números"),
    clientName: z.string(),

    createdAfter: z.date().nullable().optional(),
    createdBefore: z.date().nullable().optional(),

    ignoreDelivered: z.boolean(),
    ignoreCancelled: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.createdAfter && data.createdBefore) {
      if (data.createdBefore < data.createdAfter) {
        ctx.addIssue({
          code: "custom",
          message: "Fechas inválidas",
          path: ["createdAfter"],
        });

        ctx.addIssue({
          code: "custom",
          message: "Fechas inválidas",
          path: ["createdBefore"],
        });
      }
    }
  });
export type FindOrdersFilterFormData = z.infer<
  typeof findOrdersFilterFormSchema
>;
