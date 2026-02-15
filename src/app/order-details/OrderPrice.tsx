import useGetClientOrderByIdQuery from "@/queries/useGetClientOrderByIdQuery";
import { Spinner } from "../__components/ui/spinner";

type orderPriceProps = {
  orderId: string;
};

export default function OrderPrice({ orderId }: orderPriceProps) {
  const orderQuery = useGetClientOrderByIdQuery(orderId);
  if (orderQuery.isError) {
    return (
      <p>Ha ocurrido un error cargando la orden: {orderQuery.error.message}</p>
    );
  }

  if (orderQuery.isLoading || !orderQuery.data) {
    return (
      <span className="flex gap-2">
        <Spinner />
        <span>Cargando orden...</span>
      </span>
    );
  }

  return (
    <div className="grid grid-cols-[auto_1fr] ml-20 gap-x-4">
      <p className="place-self-center">precio del pedido:</p>
      <p className="text-4xl">${orderQuery.data.packagePrice}</p>
      <p className="ml-auto col-start-1 place-self-center">precio del envío:</p>
      <p className="text-4xl">${orderQuery.data.deliveryPrice}</p>
      <p className="ml-auto col-start-1 place-self-center">ya pagado:</p>
      <p className="text-4xl">${orderQuery.data.moneyPaidByClient}</p>
    </div>
  );
}
