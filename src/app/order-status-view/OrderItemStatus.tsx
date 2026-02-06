import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import CircularProgress from "../__components/CircularProgress";
import { OrderStatus } from "@/features/models/OrderModel";
import Link from "next/link";
import { getOrderStatusInfo } from "@/features/models/OrderModel";

type OrderItemStatusProps = {
  orderStatus: OrderStatus;
  createdAt: Date;
  products: {
    name: string;
  }[];
  orderId: string;
};
export default function OrderItemStatus({
  orderStatus,
  createdAt,
  products,
  orderId,
}: OrderItemStatusProps) {
  const { label, progress, color } = getOrderStatusInfo(orderStatus);

  return (
    <Link
      href={`/order/${orderId}`}
      className="mr-auto grid grid-cols-[auto_1fr_auto] gap-y-1 gap-x-4 py-4  text-gray-400 hover:text-primary transition-colors"
    >
      <div className="row-span-3 h-fit place-self-center">
        <CircularProgress
          size={64}
          progress={progress}
          color={color}
        ></CircularProgress>
      </div>
      <h3 className="text-xl">{label}</h3>
      <ChevronRightIcon
        size={24}
        className=" row-span-3 self-start"
      ></ChevronRightIcon>
      <div>
        <p className="font-light text-sm">
          creado el{" "}
          {createdAt.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "numeric",
            year: "2-digit",
          })}
        </p>

        <p className="font-light text-sm line-clamp-1">
          {products.map((p) => p.name).join(", ")}
        </p>
      </div>
    </Link>
  );
}
