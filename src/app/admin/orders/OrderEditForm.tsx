"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/app/__components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/__components/ui/field";
import AdminSelectStatus from "./AdminSelectStatus";
import { OrderStatus } from "@/features/models/OrderModel";
import {
  OrderEditFormData,
  orderEditFormSchema,
} from "@/app/__schemas/orderEditForm.schema";
import { cn } from "@/app/__lib/utils";
import { Button } from "@/app/__components/ui/button";
import { Spinner } from "@/app/__components/ui/spinner";

type OrderEditFormProps = {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => void;
};
export default function OrderEditForm({
  currentStatus,
  onStatusChange,
}: OrderEditFormProps) {
  const router = useRouter();
  const form = useForm<OrderEditFormData>({
    resolver: zodResolver(orderEditFormSchema),
    defaultValues: {
      status: currentStatus,
      amountPaidByClient: 0,
      investedMoney: 0,
      packagePrice: 0,
      shippingPrice: 0,
    },
  });
  const onSubmit = (data: OrderEditFormData) => {
    form.reset(data);
  };

  return (
    <div>
      <form id="order-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Estado del pedido</FieldLabel>
                <AdminSelectStatus
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    onStatusChange(val);
                  }}
                ></AdminSelectStatus>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="packagePrice"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Precio del paquete (USD)</FieldLabel>
                <Input
                  {...field}
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
            name="shippingPrice"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Precio del envío (USD)</FieldLabel>
                <Input
                  {...field}
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
            name="investedMoney"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Dinero invertido (USD)</FieldLabel>
                <Input
                  {...field}
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
            name="amountPaidByClient"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Dinero pagado por el cliente (USD)</FieldLabel>
                <Input
                  {...field}
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
              <Spinner
                data-icon="inline-start"
                className={cn(!form.formState.isSubmitting && "hidden")}
              />
              Aplicar
            </Button>
            <Button
              type="reset"
              variant="secondary"
              onClick={() => form.reset()}
              disabled={form.formState.isSubmitting}
            >
              <Spinner
                data-icon="inline-start"
                className={cn(!form.formState.isSubmitting && "hidden")}
              />
              Deshacer
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
