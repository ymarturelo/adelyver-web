import { Button } from "@/app/__components/ui/button";
import OrderAdminPanel from "./OrderAdminPanel";
import { Filter } from "lucide-react";
import Link from "next/link";

export default function OrderAdminPanelPage() {
  return (
    <div className="grow grid grid-rows-[auto_1fr]">
      <header className="px-8 max-w-3xl mb-4 self-center">
        <h1 className="text-h3">Pedidos</h1>
      </header>
      <main className="grid grid-rows-[1fr_auto] w-full px-8 max-w-3xl">
        <OrderAdminPanel />
        <Button
          className="sticky ml-auto bottom-12 rounded-full p-0 size-fit aspect-square"
          title="Abrir formulario de crear orden"
          asChild
        >
          <Link href="/admin/orders/search" title="Filtrar pedidos">
            <Filter className="size-6" />
          </Link>
        </Button>
      </main>
    </div>
  );
}
