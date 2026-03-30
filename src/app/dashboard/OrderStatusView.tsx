"use client";

import { Button } from "../__components/ui/button";
import { ClipboardPlusIcon } from "lucide-react";
import OrderItemStatus from "./OrderItemStatus";
import { Spinner } from "../__components/ui/spinner";
import useGetClientAllOrders from "@/queries/useGetClientAllOrdersQuery";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../__components/ui/empty";
import { DrawerTrigger } from "../__components/ui/drawer";

export default function OrderStatusView() {
  const ordersQuery = useGetClientAllOrders();
  if (ordersQuery.isError) {
    return (
      <p>
        Ha ocurrido un error cargando los pedidos: {ordersQuery.error.message}
      </p>
    );
  }

  if (ordersQuery.isLoading || !ordersQuery.data) {
    return (
      <span className="flex items-center justify-center p-20 gap-3">
        <Spinner />
        <span>Cargando pedidos...</span>
      </span>
    );
  }

  if (ordersQuery.data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClipboardPlusIcon />
          </EmptyMedia>
          <EmptyTitle>No tienes pedidos</EmptyTitle>
          <EmptyDescription>
            No has creado ningún pedido aún. Empieza creando el primero pegando
            un link de tu carrito.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <DrawerTrigger asChild>
            <Button>Crear pedido</Button>
          </DrawerTrigger>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ul className="grd">
      {ordersQuery.data.map((order) => (
        <li key={order.id}>
          <OrderItemStatus
            orderId={order.id}
            createdAt={order.createdAt}
            orderStatus={order.status}
          />
        </li>
      ))}
    </ul>
  );
}
