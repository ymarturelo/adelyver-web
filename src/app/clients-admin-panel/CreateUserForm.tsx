"use client";
import { Controller, useForm, UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../__components/ui/field";
import { Input } from "../__components/ui/input";
import {
  CreateUserFormData,
  createUserSchema,
} from "../__schemas/createClientForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CreateUserForm() {
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      gmail: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: CreateUserFormData) => {
    console.log("Cliente a crear:", data);
  };
  return (
    <div className="w-full overflow-auto max-w-lg mx-auto px-6 pb-6">
      <form id="create-user-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="pb-2">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nombre del usuario</FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
          <Controller
            name="gmail"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Correo Electrónico</FieldLabel>
                <Input {...field} placeholder="" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Número de teléfono</FieldLabel>
                <Input {...field} placeholder="" type="number" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Contraseña</FieldLabel>
                <Input {...field} placeholder="" type="password" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Confirmar Contraseña</FieldLabel>
                <Input {...field} placeholder="" type="password" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>
        </FieldGroup>
      </form>
    </div>
  );
}
