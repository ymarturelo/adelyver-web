import {
  ProductFormValues,
  productFormValuesSchema,
} from "@/app/__schemas/productFormValuesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProductForm from "./ProductForm";
import { updateProductByAdminAction } from "@/features/actions/OrdersController.actions";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/__components/ui/drawer";
import { Button } from "@/app/__components/ui/button";
import { Spinner } from "@/app/__components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ProductModel } from "@/features/models/ProductModel";
import { getDirtyItemsData } from "@/app/__lib/getDirtyItemsData";
import { CheckIcon, ChevronLeft } from "lucide-react";

type CreateProductFormProps = {
  product: ProductModel;
  children: React.ReactNode;
};

export default function EditProductForm({
  product,
  children,
}: CreateProductFormProps) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormValuesSchema),
    defaultValues: {
      trackingNumber: product.trackingNumber,
      name: product.name,
      idFromShop: product.idFromShop,
      url: product.url,
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    const dirty = getDirtyItemsData(data, form.formState.dirtyFields);

    const res = await updateProductByAdminAction({ ...dirty, id: product.id });
    if (!res.ok) {
      toast.error(res.error.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    toast.success("Producto editado correctamente");

    setIsDrawerOpen(false);
    form.reset();
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Actualizar producto</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id={`update-product-form-${product.id}`}
          className="w-full overflow-auto max-w-lg mx-auto px-6 pb-6"
        >
          <ProductForm id={`update-product-form-${product.id}`} form={form} />
        </form>
        <DrawerFooter className="grid gap-2">
          <Button
            type="submit"
            form={`update-product-form-${product.id}`}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <CheckIcon />
            )}
            Actualizar
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
  );
}
