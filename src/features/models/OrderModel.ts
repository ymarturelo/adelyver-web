export const ORDER_STATUSES = [
  "pending_review",
  "confirmed",
  "waiting_for_payment",
  "ready_for_pickup",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

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
