"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/__components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/__components/ui/field";
import AdminSelectStatus from "./AdminSelectStatus";
import { OrderModel } from "@/features/models/OrderModel";
import {
  OrderEditFormData,
  orderEditFormSchema,
} from "@/app/__schemas/orderEditForm.schema";
import { cn } from "@/app/__lib/utils";
import { Button } from "@/app/__components/ui/button";
import { Spinner } from "@/app/__components/ui/spinner";
import { updateOrderByAdminAction } from "@/features/actions/OrdersController.actions";
import { getDirtyItemsData } from "@/app/__lib/getDirtyItemsData";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Undo } from "lucide-react";

type OrderEditFormProps = {
  order: OrderModel;
};

export default function OrderEditForm({ order }: OrderEditFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<OrderEditFormData>({
    resolver: zodResolver(orderEditFormSchema),
    defaultValues: {
      status: order.status,
      moneyPaidByClient: order.moneyPaidByClient,
      spentMoney: order.spentMoney,
      packagePrice: order.packagePrice,
      deliveryPrice: order.deliveryPrice,
    },
  });

  const onSubmit = async (data: OrderEditFormData) => {
    const dirtyFields = form.formState.dirtyFields;
    const dirtyValues = getDirtyItemsData(data, dirtyFields);

    const res = await updateOrderByAdminAction({
      ...dirtyValues,
      orderId: order.id,
    });

    if (!res.ok) {
      toast.error(res.error.message);
    } else {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      form.reset(data);
    }
  };

  const isCancelled = order.status === "cancelled";

  return (
    <div>
      <form id="order-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>

          {!isCancelled && <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Estado del pedido</FieldLabel>
                <AdminSelectStatus
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />}
          <Controller
            control={form.control}
            name="packagePrice"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Precio del paquete (USD)</FieldLabel>
                <Input
                  {...field}
                  disabled={isCancelled}
                  id="order-form-package-price"
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="deliveryPrice"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Precio del envío (USD)</FieldLabel>
                <Input
                  {...field}
                  disabled={isCancelled}
                  id="order-form-shipping-price"
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="spentMoney"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Dinero invertido (USD)</FieldLabel>
                <Input
                  {...field}
                  disabled={isCancelled}
                  id="order-form-invested-money"
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                  type="number"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="moneyPaidByClient"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Dinero pagado por el cliente (USD)</FieldLabel>
                <Input
                  {...field}
                  disabled={isCancelled}
                  id="order-form-aPBC"
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div
            className={cn(
              "flex justify-end gap-x-2",
              !form.formState.isDirty && "hidden"
            )}
          >
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Check />
              )}
              Aplicar
            </Button>
            <Button
              type="reset"
              variant="secondary"
              onClick={() => form.reset()}
              disabled={form.formState.isSubmitting}
            >
              <Undo />
              Deshacer
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
