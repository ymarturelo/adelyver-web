"use client";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../../__components/ui/field";
import { Input } from "../../__components/ui/input";
import {
  CreateUserFormData,
  createUserSchema,
} from "../../__schemas/createClientForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientAction } from "@/features/actions/ClientsController.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type CreateUserFormProps = {
  onSuccess?: () => void;
  onLoading?: (loading: boolean) => void;
};

export default function CreateUserForm({
  onSuccess,
  onLoading,
}: CreateUserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
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

  const onSubmit = async (data: CreateUserFormData) => {
    onLoading?.(true);
    try {
      const res = await createClientAction({
        fullName: data.name,
        email: data.gmail,
        phone: data.phone,
        password: data.password,
      });

      if (!res.ok) {
        toast.error(res.error.message);
        return;
      }

      toast.success("Cliente creado correctamente");
      await queryClient.invalidateQueries({ queryKey: ["clients"] });

      onSuccess?.();
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      onLoading?.(false);
    }
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
