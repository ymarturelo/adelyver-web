"use client";

import { Button } from "../__components/ui/button";
import { Plus } from "lucide-react";
import OrderItemStatus from "./OrderItemStatus";
import { Spinner } from "../__components/ui/spinner";
import useGetClientAllOrders from "@/queries/useGetClientAllOrdersQuery";

export default function OrderStatusView() {
  const ordersQuery = useGetClientAllOrders();
  if (ordersQuery.isError) {
    return (
      <p>
        Ha ocurrido un error cargando los pedidos:{" "}
        {ordersQuery.error.message}
      </p>
    );
  }

  if (ordersQuery.isLoading || !ordersQuery.data) {
    return (
      <span className="flex gap-2">
        <Spinner />
        <span>Cargando pedidos...</span>
      </span>
    );
  }
  return (
    <>
      <div className="px-6 w-full max-w-2xl">
        <h1 className="mb-5">Tus pedidos</h1>
        {ordersQuery.data.map((order) => (
          <OrderItemStatus
            orderId={order.id}
            createdAt={order.createdAt}
            orderStatus={order.status}
          />
        ))}
      </div>
      <Button
        variant="outline"
        size="lg"
        className="p-6 rounded-full ml-auto mr-6 mt-10"
      >
        <Plus className="" />
      </Button>
    </>
  );
}
