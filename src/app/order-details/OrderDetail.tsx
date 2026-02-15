"use client";
import { getClientOrderByIdAction } from "@/features/actions/OrdersController.actions";
import OrderPrice from "./OrderPrice";
import ProductLink from "./ProductLink";
import ProductStatusDetails from "./ProductStatusDetail";
import { useParams } from "next/navigation";
import useGetClientOrderByIdQuery from "@/queries/useGetClientOrderByIdQuery";
import { Spinner } from "../__components/ui/spinner";

export default function OrderDetails() {
  const params = useParams();
  const orderId = params.id as string;
  const { data: order, isLoading } = useGetClientOrderByIdQuery(orderId);
  if (isLoading)
    return (
      <div className="p-10 flex justify-center">
        <Spinner />
      </div>
    );
  if (!order) return <p className="p-10 text-center">Pedido no encontrado</p>;
  return (
    <>
      <div className="px-6 w-full max-w-2xl">
        <h1 className="mb-5">Tus pedidos</h1>
        <ProductStatusDetails
          orderId={orderId}
          createdAt={new Date(order.createdAt)}
        />
        <ProductLink orderId={orderId}></ProductLink>
      </div>
      <OrderPrice orderId={orderId} />
    </>
  );
}
