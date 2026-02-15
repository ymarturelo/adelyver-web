"use client";
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
import { Separator } from "../__components/ui/separator";
import ProductAdminEdit from "./ProductAdminEdit";
import { Button } from "../__components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../__components/ui/drawer";
import ProductsEditForm from "./ProductFormValues";
import { Spinner } from "../__components/ui/spinner";
import {
  ProductFormValues,
  productFormValuesSchema,
} from "../__schemas/productFormValuesSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useClientGetOrderProducts from "@/queries/useClientGetOrderProducts";

type OrderStatusSummaryProps = {
  orderStatus: OrderStatus;
  createdAt: Date;
  orderId: string;
};
export default function OrderStatusSummary({
  orderStatus: initialStatus,
  createdAt,
  orderId,
}: OrderStatusSummaryProps) {
  const productsQuery = useClientGetOrderProducts(orderId);

  const [currentStatus, setCurrentStatus] =
    useState<OrderStatus>(initialStatus);
  const { label, progress, color } = getOrderStatusInfo(currentStatus);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormValuesSchema),
    defaultValues: {
      trackingNumber: "",
      name: "",
      productId: "",
      productLink: "",
    },
  });
  const onSubmit = (data: ProductFormValues) => {
    console.log("Datos válidos:", data);
  };

  if (productsQuery.isError) {
    return (
      <p>
        Ha ocurrido un error cargando los productos:{" "}
        {productsQuery.error.message}
      </p>
    );
  }

  if (productsQuery.isLoading || !productsQuery.data) {
    return (
      <span className="flex gap-2">
        <Spinner />
        <span>Cargando productos...</span>
      </span>
    );
  }

  const createdBy = "lol";

  return (
    <>
      <Accordion type="single" collapsible className="max-w-lg">
        <AccordionItem className="" value="shipping">
          <div className="grid grid-cols-[auto_1fr] gap-y-1 gap-x-4 items-center">
            <div>
              <CircularProgress
                size={64}
                progress={progress}
                color={color}
              ></CircularProgress>
            </div>
            <AccordionTrigger className=" ... [&>svg]:h-6 [&>svg]:w-6 w-[100%] text-gray-400 hover:no-underline hover:text-primary transition-colors">
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
                  {productsQuery.data.map((p) => p.name).join(", ")}
                </p>
              </div>
            </AccordionTrigger>
            <div className="col-span-2">
              <AccordionContent>
                <OrderEditForm
                  currentStatus={currentStatus}
                  onStatusChange={setCurrentStatus}
                />
                <ProductAdminEdit
                  form={form}
                  products={productsQuery.data}
                  createdBy={createdBy}
                />
                <div className="grid gap-y-5 mt-10 ">
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button
                        variant={"outline"}
                        onClick={() =>
                          form.reset({
                            trackingNumber: "",
                            name: "",
                            productId: "",
                            productLink: "",
                          })
                        }
                      >
                        Añadir Producto
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Añadir producto</DrawerTitle>
                      </DrawerHeader>
                      <ProductsEditForm form={form} createdBy={createdBy} />
                      <DrawerFooter>
                        <Button
                          onClick={form.handleSubmit(onSubmit)}
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting && (
                            <Spinner className="mr-2" />
                          )}
                          Aplicar
                        </Button>
                        <DrawerClose asChild>
                          <Button variant="secondary">Atrás</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant={"secondary"}>Cancelar Pedido</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Cancelar Pedido</DrawerTitle>
                        <DrawerDescription>
                          Está seguro que desea eliminar este pedido? Esta
                          acción no se puede deshacer
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        <Button variant="destructive">Cancelar Pedido</Button>
                        <DrawerClose asChild>
                          <Button variant="secondary">Atrás</Button>
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
    </>
  );
}
