import { OrderStatus } from "@/features/models/OrderModel";
import OrderEditForm from "./OrderEditForm";
import OrderStatusSummary from "./OrderStatusSummary";

type OrderMock = {
  id: string;
  status: OrderStatus;
  user: string;
  products: {
    name: string;
    productLink: string;
    productId: number;
    trackingNumber: number;
  }[];
};

const orders: OrderMock[] = [
  {
    id: "ord_123",
    status: "confirmed",
    user: "Yoel Rodriguez",
    products: [
      {
        name: "Camiseta",
        productId: 459874123,
        productLink: "http://...fgfdgffgfb",
        trackingNumber: 5698745896,
      },
      {
        name: "Zapato",
        productId: 4589783,
        productLink: "http://...fgfdgffgfb",
        trackingNumber: 5698745896,
      },
      {
        name: "Abrigo",
        productId: 23658974,
        productLink: "http://...fgfdgffgfb",
        trackingNumber: 5698745896,
      },
    ],
  },
  {
    id: "ord_456",
    status: "pending_review",
    user: "Juan Perez",
    products: [
      {
        name: "Zapato",
        productId: 45678952155,
        productLink: "http://...fgfvcvcxdcvxcvxcv",
        trackingNumber: 58996367890,
      },
    ],
  },
  {
    id: "ord_789",
    status: "waiting_for_payment",
    user: "Alicia Alonso",
    products: [
      {
        name: "Zapato",
        productId: 2,
        productLink: "http://...fvvcgfvcv ",
        trackingNumber: 67890,
      },
    ],
  },
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
            products={order.products}
            createdBy={order.user}
          />
        ))}
      </div>
    </>
  );
}
