"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { OrderFormData } from "../__schemas/orderForm.schema";
import { Field, FieldError, FieldGroup } from "../__components/ui/field";
import { Input } from "../__components/ui/input";

type CreateOrderFormProps = {
  id: string;
  form: UseFormReturn<OrderFormData>;
  onSubmit: (data: OrderFormData) => void;
};

export default function OrderForm({
  id,
  form,
  onSubmit,
}: CreateOrderFormProps) {
  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="url"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                id="order-form-name"
                aria-invalid={fieldState.invalid}
                placeholder="https://lorem-store.ipsum.com/ropa..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
