"use client";
import { Controller, UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../__components/ui/field";
import { Input } from "../../__components/ui/input";
import { CreateUserFormData } from "../../__schemas/createClientForm.schema";

type CreateUserFormProps = {
  form: UseFormReturn<CreateUserFormData, object>;
};

export default function UserForm({ form }: CreateUserFormProps) {
  return (
    <FieldGroup className="pb-2">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Nombre del usuario</FieldLabel>
            <Input {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="gmail"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Correo Electrónico</FieldLabel>
            <Input {...field} placeholder="" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="phone"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Número de teléfono</FieldLabel>
            <Input {...field} placeholder="" type="number" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Contraseña</FieldLabel>
            <Input {...field} placeholder="" type="password" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Confirmar Contraseña</FieldLabel>
            <Input {...field} placeholder="" type="password" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
