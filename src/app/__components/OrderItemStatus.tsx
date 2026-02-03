import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import CircularProgress from "./CircularProgress";
import {
  ORDER_STATUSES,
  OrderStatus,
  OrderStatusValues,
} from "@/features/models/OrderModel";
import Link from "next/link";
import { getOrderStatusInfo } from "@/features/models/OrderModel";

type OrderItemStatusProps = {
  orderStatus: OrderStatus;
  createdAt: Date;
  createdBy?: string;
  products: {
    name: string;
  }[];
  mode?: "link" | "accordion";
  onToggle?: () => void;
  isOpen?: boolean;
};
export default function OrderItemStatus({
  orderStatus,
  createdAt,
  createdBy,
  products,
  mode = "link",
  onToggle,
  isOpen,
}: OrderItemStatusProps) {
  const { label, progress, color } = getOrderStatusInfo(orderStatus);
  const isAccordion = mode === "accordion";
  const Icon = isAccordion ? ChevronDownIcon : ChevronRightIcon;
  const buttonClasses =
    "row-span-3 text-gray-400 hover:text-primary transition-colors self-start";

  return (
    <div className="mr-auto grid grid-cols-[auto_1fr_auto] gap-y-1 gap-x-4 py-4">
      <div className="row-span-3 h-fit place-self-center">
        <CircularProgress
          size={64}
          progress={progress}
          color={color}
        ></CircularProgress>
      </div>
      <h3 className="text-xl">{label}</h3>

      {isAccordion ? (
        <button onClick={onToggle} className={buttonClasses}>
          <Icon
            size={32}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      ) : (
        <Link href={"#"} className={buttonClasses}>
          <Icon size={32} />
        </Link>
      )}
      <div>
        <p className="font-light text-sm">
          creado el{" "}
          {createdAt.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "numeric",
            year: "2-digit",
          })}
          {createdBy && ` por ${createdBy}`}
        </p>

        <p className="font-light text-sm line-clamp-1">
          {products.map((p) => p.name).join(", ")}
        </p>
      </div>
    </div>
  );
}
