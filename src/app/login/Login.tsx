"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { LoginData, loginSchema } from "../__schemas/login.schema";
import {
  loginByEmailAction,
  loginByPhoneAction,
} from "@/features/actions/ClientsController.actions";
import { toast } from "sonner";
import { Spinner } from "../__components/ui/spinner";
import { cn } from "../__lib/utils";

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

    let res;
    if (isEmail) {
      res = await loginByEmailAction(data.email, data.password);
    } else {
      res = await loginByPhoneAction(data.email, data.password);
    }

    if (!res.ok) {
      toast.error(res.error.message);
      return;
    }
    toast.success("¡Bienvenido!");
    router.push("/dashboard");
    router.refresh();
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
      </CardFooter>
    </Card>
  );
}
