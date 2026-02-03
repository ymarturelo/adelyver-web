import OrderItemStatus from "./OrderItemStatus";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

type OrderStatusViewProps = {
  mode?: "link" | "accordion";
  showAddBooton?: boolean;
  isAdmin?: boolean;
};

export default function OrderStatusView({
  mode = "link",
  showAddBooton = true,
  isAdmin = false,
}: OrderStatusViewProps) {
  return (
    <>
      <div className="px-6 w-full max-w-2xl">
        <h1 className="mb-5">Tus pedidos</h1>
        <OrderItemStatus
          mode={mode}
          orderStatus="cancelled"
          createdAt={new Date()}
          createdBy={isAdmin ? "Admin Juan" : undefined}
          products={[
            { name: "camiseta" },
            { name: "redstone" },
            { name: "manzana" },
            { name: "zapato" },
          ]}
        />
        <OrderItemStatus
          mode={mode}
          orderStatus="confirmed"
          createdAt={new Date()}
          createdBy={isAdmin ? "Admin Juan" : undefined}
          products={[
            { name: "camiseta" },
            { name: "redstone" },
            { name: "manzana" },
            { name: "zapato" },
          ]}
        />
        <OrderItemStatus
          mode={mode}
          orderStatus="waiting_for_payment"
          createdAt={new Date()}
          createdBy={isAdmin ? "Admin Juan" : undefined}
          products={[
            { name: "colcha" },
            { name: "redstone" },
            { name: "manzana" },
          ]}
        />
      </div>
      {showAddBooton && (
        <Button
          variant="outline"
          size="lg"
          className="size-20 p-6 rounded-full ml-auto mr-6"
        >
          <Plus className="size-7" />
        </Button>
      )}
    </>
  );
}
