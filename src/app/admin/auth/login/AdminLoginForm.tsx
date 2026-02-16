"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginByEmailAction } from "@/features/actions/ClientsController.actions";
import { toast } from "sonner";
import {
  AdiminLoginFormData,
  adminLoginFormSchema,
} from "@/app/__schemas/adminLoginForm.schema";
import {
  Card,
  CardContent,
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
import { Input } from "@/app/__components/ui/input";
import { Button } from "@/app/__components/ui/button";
import { Spinner } from "@/app/__components/ui/spinner";
import { cn } from "@/app/__lib/utils";

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
    router.push("/clients-admin-panel");
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
