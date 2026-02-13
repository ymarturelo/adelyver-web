"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "../__schemas/register.schema";
import { useRouter } from "next/navigation";
import { Input } from "@/app/__components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/__components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/__components/ui/field";
import { Button } from "@/app/__components/ui/button";
import { Spinner } from "../__components/ui/spinner";
import { cn } from "../__lib/utils";
import { createClientAction } from "@/features/actions/ClientsController.actions";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const res = await createClientAction({
      fullName: data.name,
      password: data.password,
      phone: data.phone,
      email: data.email,
    });

    if (!res.ok) {
      toast.error(res.error.message);
      return;
    }
    toast.success("¡Bienvenido!");
    router.refresh();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Regístrate</CardTitle>
        <CardDescription>
          Obtén acceso a nuestra plataforma sin tener que interactuar con un
          administrador.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nombre completo</FieldLabel>
                  <Input
                    {...field}
                    id="register-form-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Juanito"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    id="register-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="juanito@gmail.com"
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Teléfono</FieldLabel>
                  <Input
                    {...field}
                    id="register-form-phone"
                    aria-invalid={fieldState.invalid}
                    placeholder="+53********"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Contraseña</FieldLabel>
                  <Input
                    type="password"
                    {...field}
                    id="register-form-password"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Confirmar Contraseña</FieldLabel>
                  <Input
                    type="password"
                    {...field}
                    id="register-form-confirmPassword"
                    aria-invalid={fieldState.invalid}
                    placeholder=""
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          form="register-form"
          disabled={form.formState.isSubmitting}
        >
          <Spinner
            data-icon="inline-start"
            className={cn(!form.formState.isSubmitting && "hidden")}
          />
          Registrarse
        </Button>
      </CardFooter>
    </Card>
  );
}
