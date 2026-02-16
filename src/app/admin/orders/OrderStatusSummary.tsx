"use client";
import { getOrderStatusInfo, OrderStatus } from "@/features/models/OrderModel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/__components/ui/accordion";
import OrderEditForm from "./OrderEditForm";
import { useState } from "react";
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
import ProductsEditForm from "./ProductFormValues";
import { Spinner } from "@/app/__components/ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useClientGetOrderProducts from "@/queries/useClientGetOrderProducts";
import { useUpdateOrder } from "@/mutations/useUpdateAdminOrder";
import {
  ProductFormValues,
  productFormValuesSchema,
} from "@/app/__schemas/productFormValuesSchema";
import CircularProgress from "@/app/__components/CircularProgress";

type OrderStatusSummaryProps = {
  orderStatus: OrderStatus;
  createdAt: Date;
  orderId: string;
  spentMoney: string;
  moneyPaidByClient: string;
};
export default function OrderStatusSummary({
  orderStatus: initialStatus,
  createdAt,
  orderId,
  spentMoney,
  moneyPaidByClient,
}: OrderStatusSummaryProps) {
  const productsQuery = useClientGetOrderProducts(orderId);
  const updateOrderMutation = useUpdateOrder();

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
  const handleCancelOrder = () => {
    updateOrderMutation.mutate(
      {
        orderId,
        status: "cancelled",
        spentMoney: Number(spentMoney),
        paidByClient: Number(moneyPaidByClient),
      },
      {
        onSuccess: () => {
          setCurrentStatus("cancelled" as OrderStatus);
        },
      }
    );
  };

  if (productsQuery.isError) {
    return <p>Ha ocurrido un error de tipo: {productsQuery.error.message}</p>;
  }

  const products = productsQuery.data ?? [];
  const createdBy = "lol";

  return (
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
                {productsQuery.isLoading || !productsQuery.data ? (
                  <span className="flex gap-1 items-center">
                    <Spinner />
                    <span>Cargando productos....</span>
                  </span>
                ) : (
                  productsQuery.data.map((p) => p.name).join(", ")
                )}
              </p>
            </div>
          </AccordionTrigger>
          <div className="col-span-2">
            <AccordionContent>
              <OrderEditForm
                currentStatus={currentStatus}
                onStatusChange={setCurrentStatus}
              />
              {/* <ProductAdminEdit
                  form={form}
                  products={productsQuery.data}
                  createdBy={createdBy}
                /> */}
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
                        Está seguro que desea cancelar este pedido? Esta acción
                        no se puede deshacer
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button
                        variant="destructive"
                        onClick={handleCancelOrder}
                        disabled={updateOrderMutation.isPending}
                      >
                        {updateOrderMutation.isPending && (
                          <Spinner className="mr-2" />
                        )}
                        Confirmar Cancelación
                      </Button>
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
  );
}
