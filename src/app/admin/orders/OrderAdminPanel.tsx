"use client";
import OrderStatusSummary from "./OrderStatusSummary";
import { useRouter, useSearchParams } from "next/navigation";
import useFindOrdersQuery from "@/queries/useFindOrdersQuery";
import { Spinner } from "@/app/__components/ui/spinner";
import { Button } from "@/app/__components/ui/button";
import { BrushCleaning } from "lucide-react";

export default function OrderAdminPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const clientNameFilter = searchParams.get("clientName") ?? undefined;
  const clientNumberFilter = searchParams.get("clientNumber") ?? undefined;

  const ordersQuery = useFindOrdersQuery({
    trackingNumber: searchParams.get("trackingNumber") ?? undefined,
    clientName: searchParams.get("clientName") ?? undefined,
    clientNumber: searchParams.get("clientNumber") ?? undefined,
    productId: searchParams.get("productId") ?? undefined,
    ignoreCancelled: false,
    ignoreDelievered: false,
  });

  const clearFilters = () => {
    router.push("/clients-admin-panel");
  };

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
        {(clientNameFilter || clientNumberFilter) && (
          <div className="flex items-center w-full gap-2 mb-6 p-2 ">
            <span className="text-xl">
              Pedidos de {clientNameFilter || clientNumberFilter}
            </span>{" "}
          </div>
        )}

        {ordersQuery.data.length == 0 && <p>Aún no hay pedidos</p>}
        {ordersQuery.data.map((order) => (
          <OrderStatusSummary
            key={order.id}
            orderId={order.id}
            orderStatus={order.status}
            createdAt={order.createdAt}
            spentMoney={String(order.spentMoney)}
            moneyPaidByClient={String(order.moneyPaidByClient)}
          />
        ))}
      </div>
      <Button
        onClick={clearFilters}
        className="sticky ml-auto bottom-12 rounded-full p-0 size-fit aspect-square"
        title="Limpiar filtros"
      >
        <BrushCleaning className="size-6" />
      </Button>
    </>
  );
}
