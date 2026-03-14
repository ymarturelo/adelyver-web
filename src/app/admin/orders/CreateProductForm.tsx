import {
  ProductFormValues,
  productFormValuesSchema,
} from "@/app/__schemas/productFormValuesSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProductForm from "./ProductForm";
import { createProductByAdminAction } from "@/features/actions/OrdersController.actions";
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
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  Plus,
  PlusIcon,
  Undo,
} from "lucide-react";

type CreateProductFormProps = {
  orderId: string;
};

export default function CreateProductForm({ orderId }: CreateProductFormProps) {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormValuesSchema),
    defaultValues: {
      trackingNumber: "",
      name: "",
      idFromShop: "",
      url: "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    const res = await createProductByAdminAction({ ...data, orderId });
    if (!res.ok) {
      toast.error(res.error.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["orders"] });
    toast.success("Producto creado correctamente");

    setIsDrawerOpen(false);
    form.reset();
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <Button>
          <PlusIcon className="size-6" /> Añadir Producto
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Añadir producto</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id={`new-product-form-${orderId}`}
          className="w-full overflow-auto max-w-lg mx-auto px-6 pb-6"
        >
          <ProductForm id={`new-product-form-${orderId}`} form={form} />
        </form>
        <DrawerFooter className="grid gap-2">
          <Button
            type="submit"
            form={`new-product-form-${orderId}`}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Check />
            )}
            Añadir
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
