import { Button } from "../__components/ui/button";
import { Plus } from "lucide-react";
import OrderItemStatus from "./OrderItemStatus";

export default function OrderStatusView() {
  return (
    <>
      <div className="px-6 w-full max-w-2xl">
        <h1 className="mb-5">Tus pedidos</h1>
        <OrderItemStatus
          orderStatus="cancelled"
          createdAt={new Date()}
          orderId="1"
          products={[
            { name: "camiseta" },
            { name: "redstone" },
            { name: "manzana" },
            { name: "zapato" },
          ]}
        />
        <OrderItemStatus
          orderStatus="confirmed"
          createdAt={new Date()}
          orderId="2"
          products={[
            { name: "camiseta" },
            { name: "redstone" },
            { name: "manzana" },
            { name: "zapato" },
          ]}
        />
        <OrderItemStatus
          orderStatus="waiting_for_payment"
          createdAt={new Date()}
          orderId="3"
          products={[
            { name: "colcha" },
            { name: "redstone" },
            { name: "manzana" },
          ]}
        />
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
