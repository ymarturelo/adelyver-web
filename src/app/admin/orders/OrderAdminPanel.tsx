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
import { FindOrdersRequest } from "@/features/abstractions/IOrderController";
import { Skeleton } from "@/app/__components/ui/skeleton";

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

  const req: FindOrdersRequest = {
    trackingNumber,
    clientName,
    clientNumber,
    storeProductId: productId,
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
    const arr = Array.from({ length: 4 });
    return (
      <div className="flex flex-col gap-10 mt-4 max-w-xl">
        {arr.map((_, index) => (
          <div
            key={`orders-skeletons-${index}`}
            className="flex items-center gap-4 "
          >
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-25" />
            </div>
          </div>
        ))}
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
