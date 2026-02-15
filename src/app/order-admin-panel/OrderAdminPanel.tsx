"use client";
import OrderStatusSummary from "./OrderStatusSummary";
import { useSearchParams } from "next/navigation";
import useFindOrdersQuery from "@/queries/useFindOrdersQuery";
import { Spinner } from "../__components/ui/spinner";

export default function AdminOrderEdit() {
  const searchParams = useSearchParams();
  const ordersQuery = useFindOrdersQuery({
    trackingNumber: searchParams.get("trackingNumber") ?? undefined,
    clientName: searchParams.get("clientName") ?? undefined,
    clientNumber: searchParams.get("clientNumber") ?? undefined,
    productId: searchParams.get("productId") ?? undefined,
    ignoreCancelled: false,
    ignoreDelievered: false,
  });

  if (ordersQuery.isError) {
    return (
      <div className="p-6 text-destructive">
        Error al cargar pedidos: {ordersQuery.error.message}
      </div>
    );
  }

  if (ordersQuery.isLoading || !ordersQuery.data) {
    return (
      <div className="flex items-center justify-center p-20 gap-3">
        <Spinner /> <span>Cargando pedidos...</span>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 w-full max-w-2xl">
        <h1 className="mb-5">Pedidos</h1>
        {ordersQuery.data.length == 0} {<p>Aún no hay pedidos</p>}
        {ordersQuery.data.map((order) => (
          <OrderStatusSummary
            key={order.id}
            orderId={order.id}
            orderStatus={order.status}
            createdAt={new Date()}
          />
        ))}
      </div>
    </>
  );
}
