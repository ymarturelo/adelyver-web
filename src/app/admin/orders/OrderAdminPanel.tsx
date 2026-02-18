"use client";
import OrderStatusSummary from "./OrderStatusSummary";
import { useSearchParams } from "next/navigation";
import useFindOrdersQuery from "@/queries/useFindOrdersQuery";
import { Spinner } from "@/app/__components/ui/spinner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/__components/ui/empty";
import { ClipboardPlusIcon } from "lucide-react";

export default function OrderAdminPanel() {
  const searchParams = useSearchParams();

  const trackingNumber = searchParams.get("trackingNumber") ?? undefined;
  const clientName = searchParams.get("clientName") ?? undefined;
  const clientNumber = searchParams.get("clientNumber") ?? undefined;
  const productId = searchParams.get("productId") ?? undefined;
  const ignoreCancelled = searchParams.get("ignoreCancelled") === "true";
  const ignoreDelievered = searchParams.get("ignoreDelievered") === "true";
  const createdAfter = searchParams.get("createdAfter") ?? undefined;
  const createdBefore = searchParams.get("createdBefore") ?? undefined;

  const req = {
    trackingNumber,
    clientName,
    clientNumber,
    productId,
    ignoreCancelled,
    ignoreDelievered,
    createdAfter: createdAfter ? new Date(createdAfter) : undefined,
    createdBefore: createdBefore ? new Date(createdBefore) : undefined,
  };
  const isFiltered = Object.values(req).some(Boolean);

  const ordersQuery = useFindOrdersQuery(req);

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

  if (ordersQuery.data.length == 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ClipboardPlusIcon />
          </EmptyMedia>
          <EmptyTitle>No hay pedidos</EmptyTitle>
          <EmptyDescription>
            {isFiltered
              ? "No se encontraron pedidos que coincidan con los requisitos de búsqueda."
              : "Aún no hay pedidos registrados. Pide a tus clientes que creen uno nuevo."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="w-full">
      {ordersQuery.data.map((order) => (
        <OrderStatusSummary key={order.id} order={order} />
      ))}
    </div>
  );
}
