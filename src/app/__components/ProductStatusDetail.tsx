import {
  getOrderStatusInfo,
  OrderStatus,
  OrderStatusDescriptions,
  OrderStatusValues,
} from "@/features/models/OrderModel";
import CircularProgress from "./CircularProgress";

type ProductStatusDetailProps = {
  orderStatus: OrderStatus;
  createdAt: Date;
};

export default function ProductStatusDetails({
  orderStatus,
  createdAt,
}: ProductStatusDetailProps) {
  const description = OrderStatusDescriptions[orderStatus];
  const { label, progress } = getOrderStatusInfo(orderStatus);

  return (
    <>
      <div className="mr-auto grid grid-cols-[auto_1fr_auto] gap-y-1 gap-x-4 py-4">
        <div className="row-span-3 h-fit place-self-center">
          <CircularProgress size={64} progress={progress}></CircularProgress>
        </div>
        <h3 className="text-xl">{label}</h3>
        <p className="col-start-2 font-light text-sm">
          creado el {createdAt.toDateString()}
        </p>
      </div>
      <p className="font-light text-sm mt-2">{description}</p>
    </>
  );
}
