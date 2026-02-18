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

type OrderStatusSummaryProps = {
  order: OrderModel;
};
export default function OrderStatusSummary({ order }: OrderStatusSummaryProps) {
  const updateOrderMutation = useUpdateOrder();

  const { label, progress, color } = getOrderStatusInfo(order.status);

  return (
    <Accordion type="single" collapsible className="max-w-lg">
      <AccordionItem className="" value="shipping">
        <div className="grid grid-cols-[auto_1fr] gap-y-1 gap-x-4 items-center">
          <div>
            <CircularProgress size={64} progress={progress} color={color} />
          </div>
          <AccordionTrigger className="[&>svg]:h-6 [&>svg]:w-6 w-[100%] text-gray-400 hover:no-underline hover:text-primary transition-colors">
            <div className="text-left">
              <h3 className="text-xl">{label}</h3>
              <p className="font-light text-sm">
                creado el{" "}
                {order.createdAt.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "numeric",
                  year: "2-digit",
                })}
                {` por CLIENT_NAME`}
              </p>
              <p className="font-light text-sm line-clamp-1">PRODUCT_SUMMARY</p>
            </div>
          </AccordionTrigger>
          <div className="col-span-2">
            <AccordionContent>
              <OrderEditForm order={order} />
              <ProductAdminEdit orderId={order.id} />
              <div className="grid gap-y-5 mt-10 ">
                <CreateProductForm orderId={order.id} />
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant={"secondary"}>Cancelar Pedido</Button>
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
                          updateOrderMutation.mutate({
                            orderId: order.id,
                            status: "cancelled",
                          })
                        }
                        disabled={updateOrderMutation.isPending}
                      >
                        {updateOrderMutation.isPending && (
                          <Spinner className="mr-2" />
                        )}
                        Confirmar Cancelación
                      </Button>
                      <DrawerClose asChild>
                        <Button variant="ghost">Atrás</Button>
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
