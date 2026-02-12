export const ORDER_STATUSES = [
  "pending_review",
  "confirmed",
  "waiting_for_payment",
  "ready_for_pickup",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const OrderStatusValues: Record<OrderStatus, string> = {
  pending_review: "Pendiente de revisión",
  confirmed: "Confirmado",
  waiting_for_payment: "Esperando pago",
  ready_for_pickup: "Listo para recoger",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const OrderStatusDescriptions: Record<OrderStatus, string> = {
  pending_review:
    "El pedido ha sido recibido y estamos verificando los detalles.",
  confirmed: "Hemos validado tu pedido y estamos preparando todo para avanzar",
  waiting_for_payment:
    "Pedido verificado; pendiente de recibir el comprobante de pago.",
  ready_for_pickup:
    "El pedido ya está disponible en el punto de entrega seleccionado.",
  delivered: "El paquete ha sido recibido con éxito por el destinatario.",
  cancelled:
    "El proceso se ha detenido por falta de pago o solicitud del cliente.",
};

export const getOrderStatusInfo = (orderStatus: OrderStatus) => {
  const label = OrderStatusValues[orderStatus];
  const statusIndex = ORDER_STATUSES.findIndex((s) => s == orderStatus);
  const latestStatusIndex = ORDER_STATUSES.length - 2;
  const statusProgress = Math.min((statusIndex / latestStatusIndex) * 100, 100);
  const color = orderStatus === "cancelled" ? "text-red-500" : "text-green-500";

  return { label, progress: statusProgress, color };
};
export const getClientStats = (orders: { status: OrderStatus }[]) => {
  const stats: Record<OrderStatus, number> = {
    pending_review: 0,
    confirmed: 0,
    waiting_for_payment: 0,
    ready_for_pickup: 0,
    delivered: 0,
    cancelled: 0,
  };
  orders.forEach((order) => {
    if (stats[order.status] !== undefined) {
      stats[order.status]++;
    }
  });

  return stats;
};

export type OrderModel = {
  id: string;
  clientId: string;
  status: OrderStatus;
  packagePrice: number;
  deliveryPrice: number;
  spentMoney: number;
  moneyPaidByClient: number;
  shopCartUrl: string;
  createdAt: Date;
  updatedAt: Date;
};
