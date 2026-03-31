"use client";
import ProductsLinks from "./ProductsLinks";
import { useParams } from "next/navigation";
import useGetClientOrderByIdQuery from "@/queries/useGetClientOrderByIdQuery";
import { Spinner } from "../../__components/ui/spinner";
import {
  getOrderStatusInfo,
  OrderStatusDescriptions,
} from "@/features/models/OrderModel";
import CircularProgress from "@/app/__components/CircularProgress";
import UpdateOrderForm from "./UpdateOrderForm";

export default function OrderDetails() {
  const params = useParams();
  const orderId = params.id as string;
  const orderQuery = useGetClientOrderByIdQuery(orderId);

  if (orderQuery.isError) {
    return (
      <p>Ha ocurrido un error cargando la orden: {orderQuery.error.message}</p>
    );
  }

  if (orderQuery.isLoading)
    return (
      <span className="flex items-center justify-center p-20 gap-3 mt-50">
        <Spinner />
        <span>Cargando pedido...</span>
      </span>
    );

  if (!orderQuery.data)
    return <p className="p-10 text-center">Pedido no encontrado</p>;

  const description = OrderStatusDescriptions[orderQuery.data.status];
  const { label } = getOrderStatusInfo(orderQuery.data.status);

  return (
    <div className="px-6 w-full max-w-2xl grid gap-4">
      <div className="mr-auto grid grid-cols-[auto_1fr_auto] gap-y-1 gap-x-4 py-4 mt-0">
        <div className="row-span-3 h-fit place-self-center">
          <CircularProgress size={64} status={orderQuery.data.status} />
        </div>
        <h3 className="text-xl">{label}</h3>
        <p className="col-start-2 font-light text-sm">
          creado el {orderQuery.data.createdAt.toLocaleDateString("es-ES")}
        </p>
      </div>
      <p className="font-light text-sm mb-4">{description}</p>
      {orderQuery.data.status === "pending_review" && (
        <UpdateOrderForm
          orderId={orderId}
          shopCartUrl={orderQuery.data.shopCartUrl}
        />
      )}
      <ProductsLinks order={orderQuery.data} />
      {orderQuery.data.status !== "pending_review" && (
        <div className="grid grid-cols-[1fr_auto] items-center text-end ml-20 gap-x-4 mt-5">
          <p className="">precio del pedido:</p>
          <p className="text-3xl">${orderQuery.data.packagePrice}</p>
          <p className="">precio del envío:</p>
          <p className="text-3xl">${orderQuery.data.deliveryPrice}</p>
          <p className="">ya pagado:</p>
          <p className="text-3xl">${orderQuery.data.moneyPaidByClient}</p>
        </div>
      )}
    </div>
  );
}
