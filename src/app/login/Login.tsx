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
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { LoginData, loginSchema } from "../__schemas/login.schema";

export default function Login() {
  const router = useRouter;
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: LoginData) => {
    console.log("Datos válidos:", data);
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Autenticarse</CardTitle>
      </CardHeader>
      <CardContent>
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
                    id="login-form-password"
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
        <Button type="submit" form="login-form">
          Autenticarse
        </Button>
      </CardFooter>
    </Card>
  );
}
