import { Separator } from "@radix-ui/react-separator";
import OrderItemStatus from "./OrderItemStatus";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

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
        className="size-15 p-6 rounded-full ml-auto mr-6"
      >
        <Plus className="size-6" />
      </Button>
    </>
  );
}
