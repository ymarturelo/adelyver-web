"use client";
import { getOrderStatusInfo, OrderModel } from "@/features/models/OrderModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/__components/ui/accordion";
import OrderEditForm from "./OrderEditForm";
import { Separator } from "@/app/__components/ui/separator";
import { Button } from "@/app/__components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/__components/ui/drawer";
import { Spinner } from "@/app/__components/ui/spinner";
import { useUpdateOrder } from "@/mutations/useUpdateAdminOrder";
import CircularProgress from "@/app/__components/CircularProgress";
import CreateProductForm from "./CreateProductForm";
import ProductAdminEdit from "./ProductAdminEdit";
import {
  BanIcon,
  Check,
  CheckIcon,
  ChevronLeft,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import { OrderDto } from "@/features/abstractions/IOrderController";
import { useState } from "react";

type OrderStatusSummaryProps = {
  order: OrderDto;
};
export default function OrderStatusSummary({ order }: OrderStatusSummaryProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const updateOrderMutation = useUpdateOrder();

  const { label } = getOrderStatusInfo(order.status);

  return (
    <Accordion type="single" collapsible className="max-w-lg">
      <AccordionItem className="" value="shipping">
        <div className="grid grid-cols-[auto_1fr] gap-y-1 gap-x-4 items-center">
          <div>
            <CircularProgress size={64} status={order.status} />
          </div>
          <AccordionTrigger className="[&>svg]:h-6 [&>svg]:w-6 w-[100%] hover:no-underline hover:text-primary transition-colors">
            <div className="text-left">
              <h3 className="text-xl">{label}</h3>
              <p className="font-light text-sm">
                creado el{" "}
                {order.createdAt.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "numeric",
                  year: "2-digit",
                })}
                {` por ${order.createdBy}`}
              </p>
              <p className="font-light text-sm line-clamp-1">
                {order.productSummary}
              </p>
            </div>
          </AccordionTrigger>
          <div className="col-span-2">
            <AccordionContent>
              <OrderEditForm order={order} />
              <ProductAdminEdit orderId={order.id} />
              <div className="grid gap-y-5 mt-10 ">
                <CreateProductForm orderId={order.id} />
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="secondary">
                      <BanIcon /> Cancelar Pedido
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Cancelar Pedido</DrawerTitle>
                      <DrawerDescription>
                        Está seguro que desea cancelar este pedido? Esta acción
                        no se puede deshacer
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          updateOrderMutation.mutate(
                            {
                              orderId: order.id,
                              status: "cancelled",
                            },
                            {
                              onSuccess: () => setIsDrawerOpen(false),
                            }
                          )
                        }
                        disabled={updateOrderMutation.isPending}
                      >
                        {updateOrderMutation.isPending ? (
                          <Spinner data-icon="inline-start" />
                        ) : (
                          <BanIcon />
                        )}
                        Cancelar Pedido
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="ghost">
                          <ChevronLeft />
                          Atrás
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </AccordionContent>
          </div>
        </div>
      </AccordionItem>
      <Separator />
    </Accordion>
  );
}
