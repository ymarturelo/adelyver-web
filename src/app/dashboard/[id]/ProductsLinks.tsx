import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import useGetClientOrderProducts from "@/queries/useGetClientOrderProducts";
import { Spinner } from "../../__components/ui/spinner";
import React from "react";
import { ClientOrderDto } from "@/features/abstractions/IOrderController";

type productLinkProps = {
  order: ClientOrderDto;
};

export default function ProductsLinks({ order }: productLinkProps) {
  const enabled = order.status !== "pending_review";
  const productQuery = useGetClientOrderProducts(order.id, enabled);

  if (!enabled) {
    return <></>;
  }

  if (productQuery.isLoading) {
    return (
      <div className="flex gap-2 items-center mt-10">
        <Spinner />
        <span className="text-sm text-muted-foreground">
          Cargando productos...
        </span>
      </div>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <p className="text-sm text-destructive mt-10">
        No se pudieron cargar los productos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1">
      {productQuery.data.map((product, index) => (
        <React.Fragment key={product.id || index}>
          <h3 className="text-xl font-medium">{product.name}</h3>
          <Link
            href={product.url}
            target="_blank"
            className="row-span-2 place-self-center"
          >
            <SquareArrowOutUpRight className="hover:text-primary transition-colors self-start size-6" />
          </Link>
          <p className="font-light text-sm col-start-1 truncate">
            {product.url}
          </p>
        </React.Fragment>
      ))}
    </div>
  );
}
