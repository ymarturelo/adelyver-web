"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
  AdiminLoginFormData,
  adminLoginFormSchema,
} from "../__schemas/adminLoginForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createClientAction,
  loginByEmailAction,
} from "@/features/actions/ClientsController.actions";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../__components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../__components/ui/field";
import { Input } from "../__components/ui/input";
import { Button } from "../__components/ui/button";
import { Spinner } from "../__components/ui/spinner";
import { cn } from "../__lib/utils";

export default function AdminLoginForm() {
  const router = useRouter();
  const form = useForm<AdiminLoginFormData>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdiminLoginFormData) => {
    const res = await loginByEmailAction(data.email, data.password);

    if (!res.ok) {
      toast.error(res.error.message);
      return;
    }
    toast.success("¡Bienvenido!");
    router.refresh();
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Panel Administrativo Adelyver </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="admin-login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Correo</FieldLabel>
                  <Input
                    {...field}
                    id="admin-login-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="juanito@gmail"
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
                    id="admin-login-form-password"
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
          form="admin-login-form"
          disabled={form.formState.isSubmitting}
        >
          <Spinner
            data-icon="inline-start"
            className={cn(!form.formState.isSubmitting && "hidden")}
          />
          Continuar
        </Button>
      </CardFooter>
    </Card>
  );
}
