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
import { Button } from "@/app/__components/ui/button";
import {
  isAdmin,
  loginByEmailAction,
  loginByPhoneAction,
} from "@/features/actions/ClientsController.actions";
import { toast } from "sonner";
import { LoginData, loginSchema } from "@/app/__schemas/login.schema";
import { Spinner } from "@/app/__components/ui/spinner";
import { cn } from "@/app/__lib/utils";

export default function Login() {
  const router = useRouter();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginData) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(data.email);

    const res = isEmail
      ? await loginByEmailAction(data.email, data.password)
      : await loginByPhoneAction(data.email, data.password);

    if (!res.ok) {
      toast.error(res.error.message);
      return;
    }

    const isAdminRes = await isAdmin();
    if (!isAdminRes.ok) {
      toast.error(isAdminRes.error.message);
      return;
    }

    toast.success("¡Bienvenido!");
    router.push(isAdminRes.data ? "/admin" : "/dashboard");
  };

  return (
    <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email o número de teléfono</FieldLabel>
              <Input
                {...field}
                id="login-form-name"
                aria-invalid={fieldState.invalid}
                placeholder="juanito@gmail"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                id="login-form-password"
                aria-invalid={fieldState.invalid}
                placeholder=""
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          form="login-form"
          disabled={form.formState.isSubmitting}
        >
          <Spinner
            data-icon="inline-start"
            className={cn(!form.formState.isSubmitting && "hidden")}
          />
          Autenticarse
        </Button>
      </FieldGroup>
    </form>
  );
}
