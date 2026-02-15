"use client";
import {
  getOrderStatusInfo,
  OrderStatusDescriptions,
} from "@/features/models/OrderModel";
import CircularProgress from "../__components/CircularProgress";
import useGetClientOrderByIdQuery from "@/queries/useGetClientOrderByIdQuery";
import { Spinner } from "../__components/ui/spinner";

type ProductStatusDetailProps = {
  createdAt: Date;
  orderId: string;
};

export default function ProductStatusDetails({
  createdAt,
  orderId,
}: ProductStatusDetailProps) {
  const {
    data: order,
    isLoading,
    isError,
    error,
  } = useGetClientOrderByIdQuery(orderId);
  if (isLoading) {
    return (
      <div className="flex items-center gap-4 py-10">
        <Spinner />
        <p className="text-sm text-muted-foreground">
          Actualizando estado del pedido...
        </p>
      </div>
    );
  }
  if (isError || !order) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
        {error?.message || "No se pudo cargar la información del pedido."}
      </div>
    );
  }
  const description = OrderStatusDescriptions[order.status];
  const { label, progress } = getOrderStatusInfo(order.status);
  return (
    <>
      <div className="mr-auto grid grid-cols-[auto_1fr_auto] gap-y-1 gap-x-4 py-4">
        <div className="row-span-3 h-fit place-self-center">
          <CircularProgress size={64} progress={progress}></CircularProgress>
        </div>
        <h3 className="text-xl">{label}</h3>
        <p className="col-start-2 font-light text-sm">
          creado el {createdAt.toLocaleDateString("es-ES")}
        </p>
      </div>
      <p className="font-light text-sm mt-2">{description}</p>
    </>
  );
}
