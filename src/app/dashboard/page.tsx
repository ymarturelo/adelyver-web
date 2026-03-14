import { Plus } from "lucide-react";
import { Button } from "../__components/ui/button";
import OrderStatusView from "./OrderStatusView";
import CreateOrderForm from "./CreateOrderForm";
import { Drawer, DrawerTrigger } from "../__components/ui/drawer";

export default function OrderStatusViewPage() {
  return (
    <div className="grid grid-rows-[auto_1fr] h-full min-h-dvh px-6">
      <header className="px- max-w-3xl mb-4 self-center">
        <h1 className="text-h3">Tus pedidos</h1>
      </header>
      <main className="w-full max-w-2xl justify-self-center h-full grid grid-rows-[1fr_auto]">
        <Drawer>
          <OrderStatusView />

          <DrawerTrigger asChild>
            <Button
              className="sticky ml-auto bottom-12 rounded-full p-0 size-fit aspect-square"
              title="Abrir formulario de crear orden"
            >
              <Plus className="size-6" />
            </Button>
          </DrawerTrigger>
          <CreateOrderForm />
        </Drawer>
      </main>
    </div>
  );
}
