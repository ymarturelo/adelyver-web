"use client";
import { ChevronRightIcon } from "lucide-react";
import CircularProgress from "../__components/CircularProgress";
import Link from "next/link";
import { OrderStatus, getOrderStatusInfo } from "@/features/models/OrderModel";

type OrderItemStatusProps = {
  orderStatus: OrderStatus;
  orderId: string;
  createdAt: Date;
};
export default function OrderItemStatus({
  orderStatus,
  orderId,
  createdAt,
}: OrderItemStatusProps) {
  const { label, progress, color } = getOrderStatusInfo(orderStatus);

  return (
    <Link
      href={`/dashboard/${orderId}`}
      className="mr-auto grid grid-cols-[auto_1fr_auto] gap-y-1 gap-x-4 py-4  text-gray-400 hover:text-primary transition-colors"
    >
      <div className="row-span-3 h-fit place-self-center">
        <CircularProgress size={64} progress={progress} color={color} />
      </div>
      <h3 className="text-xl">{label}</h3>
      <ChevronRightIcon size={24} className=" row-span-3 self-center" />
      <div>
        <p className="text-sm mb-4">
          creado el{" "}
          {createdAt.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "numeric",
            year: "2-digit",
          })}
        </p>
      </div>
    </Link>
  );
}
