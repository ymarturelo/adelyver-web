"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateOrderByClientAction } from "@/features/actions/OrdersController.actions";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  OrderFormData,
  orderFormSchema,
} from "@/app/__schemas/orderForm.schema";
import OrderForm from "../OrderForm";
import { Button } from "@/app/__components/ui/button";
import { cn } from "@/app/__lib/utils";
import { CheckIcon } from "lucide-react";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

type UpdateOrderFormProps = {
  orderId: string;
  shopCartUrl: string;
};

export default function UpdateOrderForm({
  orderId,
  shopCartUrl,
}: UpdateOrderFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      url: shopCartUrl,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: OrderFormData) => {
    const res = await updateOrderByClientAction({
      orderId,
      shopCartUrl: data.url,
    });

    if (!res.ok) {
      toast.error(res.error.message ?? "Error al actualizar el pedido");
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ["client-orders"],
    });

    toast.success("Pedido actualizado exitosamente");
    form.reset({
      url: data.url,
    });
    router.push("/dashboard");
  };

  return (
    <>
      <OrderForm id="update-order-form" form={form} onSubmit={onSubmit} />
      <Button
        className={cn(
          "w-fit justify-self-end",
          !form.formState.isDirty && "hidden"
        )}
        type="submit"
        form="update-order-form"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <span>Actualizando...</span>
        ) : (
          <span className="flex items-center gap-1">
            <CheckIcon />
            Actualizar pedido
          </span>
        )}
      </Button>
    </>
  );
}
