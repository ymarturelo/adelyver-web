"use client";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/app/__components/ui/button";
import { useMemo } from "react";
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
import { UseFormReturn } from "react-hook-form";
import { ProductModel } from "@/features/models/ProductModel";
import { ProductFormValues } from "@/app/__schemas/productFormValuesSchema";

type ProductAdminEditProps = {
  products: ProductModel[];
  form: UseFormReturn<ProductFormValues>;
  createdBy: string;
};

export default function ProductAdminEdit({
  products,
  form,
}: ProductAdminEditProps) {
  const groupedProducts = useMemo(() => {
    return Object.groupBy(products, (product) => product.trackingNumber);
  }, [products]);
  const handleEditClick = async (product: any) => {
    form.reset({
      name: product.name,
      idFromShop: String(product.productId),
      url: product.productLink,
      trackingNumber: String(product.trackingNumber),
    });
  };

  return (
    <>
      {Object.entries(groupedProducts).map(([trackingNumber, items]) => (
        <div
          key={trackingNumber}
          className="flex flex-col gap-y-6 px-5 py-8 mt-10 border border-gray-500 rounded-lg relative  "
        >
          <span className="absolute -top-4 left-4 bg-background px-2 text-xl ">
            {trackingNumber}
          </span>

          {items?.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 border-b last:border-none pb-4 last:pb-0 text-primary "
            >
              <div className="flex flex-col min-w-0">
                <h4 className="text-lg font-semibold tracking-tight">
                  {product.name}
                </h4>
                <p className="text-sm font-mono ">#{product.id}</p>
                <p className=" text-sm text-muted-foreground hover:opacity-100 transition-opacity">
                  {product.url}
                </p>
                <div className="flex row-span-3 justify-end items-center gap-x-2 "></div>
              </div>
              <div className="">
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      type="button"
                      variant={"ghost"}
                      size={"icon"}
                      className=" h-9 w-9 hover:text-destructive"
                    >
                      <Trash2 size={18}></Trash2>
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Eliminar Producto</DrawerTitle>
                      <DrawerDescription>
                        Está seguro que desea eliminar este producto? Esta
                        acción no se puede deshacer
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <Button variant="destructive">Eliminar Producto</Button>
                      <DrawerClose asChild>
                        <Button variant="secondary">Atrás</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:text-primary"
                      onClick={() => handleEditClick(product)}
                    >
                      <Pencil size={18} />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent className="max-h-[90vh]">
                    <div className="flex flex-col h-full max-w-lg mx-auto w-full overflow-hidden">
                      <DrawerHeader>
                        <DrawerTitle>Editar Producto</DrawerTitle>
                      </DrawerHeader>
                      <div className="flex-1 overflow-y-auto">
                        {/* <CreateProductForm form={form} /> */}
                      </div>
                      <DrawerFooter className="border-t bg-background">
                        <Button>Guardar Cambios</Button>
                        <DrawerClose asChild>
                          <Button variant="secondary">Atrás</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
