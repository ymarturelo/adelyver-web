"use client"
import { getOrderStatusInfo, OrderStatus } from "@/features/models/OrderModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../__components/ui/accordion";
import CircularProgress from "../__components/CircularProgress";
import OrderEditForm from "./OrderEditForm";
import { useState } from "react";

type OrderStatusSummaryProps = {
  orderStatus: OrderStatus;
  createdAt: Date;
  products: {
    name: string;
  }[];
  createdBy: string;
};
export default function OrderStatusSummary({
  orderStatus: initialStatus,
  createdAt,
  products,
  createdBy,
}: OrderStatusSummaryProps) {
  const [currentStatus, setCurrentStatus] =
    useState<OrderStatus>(initialStatus);
  const { label, progress, color } = getOrderStatusInfo(currentStatus);

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="max-w-lg"
      >
        <AccordionItem className="" value="shipping">
          <div className="grid grid-cols-[auto_1fr] gap-y-1 gap-x-4 items-center">
            <div>
              <CircularProgress
                size={64}
                progress={progress}
                color={color}
              ></CircularProgress>
            </div>
            <AccordionTrigger className="w-[100%] text-gray-400 hover:no-underline hover:text-primary transition-colors">
              <div className="text-left">
                <h3 className="text-xl">{label}</h3>
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
            </AccordionTrigger>
            <div className="col-span-2">
              <AccordionContent className="pt-2 pb-6 border-t border-dashed border-gray-800 mt-2">
                <OrderEditForm
                  currentStatus={currentStatus}
                  onStatusChange={setCurrentStatus}
                ></OrderEditForm>
              </AccordionContent>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
}
