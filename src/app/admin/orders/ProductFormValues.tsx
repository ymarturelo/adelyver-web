"use client";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/__components/ui/field";
import { Input } from "@/app/__components/ui/input";
import { ProductFormValues } from "@/app/__schemas/productFormValuesSchema";

type ProductFormValuesProps = {
  createdBy: string;
  form: UseFormReturn<ProductFormValues>;
};

export default function ProductsEditForm({
  createdBy,
  form,
}: ProductFormValuesProps) {
  return (
    <div className="w-full overflow-auto max-w-lg mx-auto px-6 pb-6">
      <FieldGroup className="pb-2">
        <Controller
          control={form.control}
          name="trackingNumber"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Número de seguimiento</FieldLabel>
              <Input
                {...field}
                id="product-values-form-trackingNumber"
                aria-invalid={fieldState.invalid}
                placeholder=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nombre del producto</FieldLabel>
              <Input
                {...field}
                id="product-values-form-name"
                aria-invalid={fieldState.invalid}
                placeholder=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="productId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>ID del producto</FieldLabel>
              <Input
                {...field}
                id="product-values-form-productId"
                aria-invalid={fieldState.invalid}
                placeholder=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="productLink"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>URL del producto</FieldLabel>
              <Input
                {...field}
                id="product-values-form-productLink"
                aria-invalid={fieldState.invalid}
                placeholder=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
