"use client";
import {
  BanIcon,
  ChevronLeft,
  ExternalLinkIcon,
  Pencil,
  Trash2,
} from "lucide-react";
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
import useGetClientOrderProducts from "@/queries/useGetClientOrderProducts";
import { Spinner } from "@/app/__components/ui/spinner";
import { deleteProductByAdminAction } from "@/features/actions/OrdersController.actions";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditProductForm from "./EditProductForm";

type ProductAdminEditProps = {
  orderId: string;
};

export default function ProductAdminEdit({ orderId }: ProductAdminEditProps) {
  const queryClient = useQueryClient();
  const productsQuery = useGetClientOrderProducts(orderId);

  const onRemoveProduct = async (productId: string) => {
    const res = await deleteProductByAdminAction(productId);

    if (!res.ok) {
      toast.error(res.error.message);
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: ["orders", orderId, "products"],
    });

    toast.success("Producto eliminado correctamente");
  };

  const removeProductMutation = useMutation({
    mutationFn: onRemoveProduct,
  });

  if (productsQuery.isError) {
    return <p>Error al cargar productos</p>;
  }
  if (productsQuery.isLoading || !productsQuery.data) {
    return (
      <div className="py-8 flex gap-2">
        <Spinner />
        <span>Cargando productos...</span>
      </div>
    );
  }

  const groupedProducts = Object.groupBy(
    productsQuery.data,
    (product) => product.trackingNumber
  );

  return (
    <>
      {Object.entries(groupedProducts).map(([trackingNumber, items]) => (
        <div
          key={trackingNumber}
          className="grid gap-y-6 px-5 py-8 mt-10 border border-gray-500 rounded-lg relative  "
        >
          <span className="absolute -top-4 left-4 bg-background px-2 text-xl ">
            {trackingNumber}
          </span>

          {items?.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 border-b last:border-none pb-4 last:pb-0"
            >
              <div className="flex flex-col min-w-0">
                <h4 className="text-lg font-semibold tracking-tight">
                  {product.name}
                </h4>
                <p className="text-sm font-mono text-muted-foreground mb-1">
                  #{product.idFromShop}
                </p>
                <Button
                  asChild
                  variant="link"
                  className="p-0 !px-0 justify-start text-muted-foreground"
                >
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm items-center gap-1 hover:opacity-100 transition-opacity"
                  >
                    <span className="truncate">{product.url}</span>
                    <ExternalLinkIcon size={16} />
                  </a>
                </Button>
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
                      <Trash2 size={18} />
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
                      <Button
                        onClick={() => removeProductMutation.mutate(product.id)}
                        variant="destructive"
                      >
                        {removeProductMutation.isPending ? (
                          <Spinner data-icon="inline-start" />
                        ) : (
                          <BanIcon />
                        )}
                        Eliminar Producto
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
                <EditProductForm product={product}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:text-primary"
                  >
                    <Pencil size={18} />
                  </Button>
                </EditProductForm>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
