"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/__components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/__components/ui/card";
import { Field, FieldError, FieldGroup } from "@/app/__components/ui/field";
import { Button } from "@/app/__components/ui/button";
import { OrderFormData, orderFormSchema } from "../__schemas/orderForm.schema";
import { Spinner } from "../__components/ui/spinner";
import { cn } from "../__lib/utils";
import { createOrderByClientAction } from "@/features/actions/OrdersController.actions";
import { toast } from "sonner";

export default function OrderForm() {
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const { isSubmitting } = form.formState;
  const onSubmit = async (data: OrderFormData) => {
    const res = await createOrderByClientAction({
      shopCartUrl: data.url,
    });

    if (!res.ok) {
      toast.error(res.error.message ?? "Error al crear el pedido");
      return;
    }

    toast.success("Pedido enviado correctamente");
    form.reset();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Inserte link del carrito</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="order-form" onSubmit={form.handleSubmit(onSubmit)}></form>
        <FieldGroup>
          <Controller
            control={form.control}
            name="url"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  id="order-form-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="https://lorem-store.ipsum.com/ropa..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" form="order-form" disabled={isSubmitting}>
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
