"use client";

import { useForm } from "react-hook-form";
import { OrderFormData, orderFormSchema } from "../__schemas/orderForm.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderByClientAction } from "@/features/actions/OrdersController.actions";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../__components/ui/drawer";
import OrderForm from "./OrderForm";
import { Button } from "../__components/ui/button";
import { Spinner } from "../__components/ui/spinner";
import { cn } from "../__lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";

export default function CreateOrderForm() {
  const queryClient = useQueryClient();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    const res = await createOrderByClientAction({
      shopCartUrl: data.url,
    });

    if (!res.ok) {
      toast.error(res.error.message ?? "Error al crear el pedido");
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ["orders"],
    });

    toast.success("Pedido creado exitosamente");
    form.reset();
  };

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Crear nuevo pedido</DrawerTitle>
        <DrawerDescription>
          Ingresa la url del carrito de compras
        </DrawerDescription>
      </DrawerHeader>
      <div className="p-4 pb-0">
        <OrderForm id="create-order-form" form={form} onSubmit={onSubmit} />
      </div>
      <DrawerFooter>
        <Button
          type="submit"
          form="create-order-form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Check />
          )}
          Crear Pedido
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}
