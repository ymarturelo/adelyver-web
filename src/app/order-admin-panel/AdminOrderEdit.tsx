import { OrderStatus } from "@/features/models/OrderModel";
import OrderEditForm from "./OrderEditForm";
import OrderStatusSummary from "./OrderStatusSummary";

type OrderMock= {
  id:string;
  status:OrderStatus;
  user:string;
}

const orders:OrderMock[] = [
    { id: "ord_123", status: "confirmed", user: "Yoel Rodriguez" },
    { id: "ord_456", status: "pending_review", user: "Juan Perez" },
    { id: "ord_789", status: "waiting_for_payment", user: "Alicia Alonso" },
  ];

export default function AdminOrderEdit() {
  return (
    <>
      <div className="px-6 w-full max-w-2xl">
        <h1 className="mb-5">Pedidos</h1>
        {orders.map((order) => (
        <OrderStatusSummary
        key={order.id}
          orderStatus={order.status}
          createdAt={new Date()}
          products={[
            { name: "camiseta" },
            { name: "redstone" },
            { name: "manzana" },
            { name: "zapato" },
          ]}
          createdBy={order.user}
        />
        ))}
      </div>
    </>
  );
}
