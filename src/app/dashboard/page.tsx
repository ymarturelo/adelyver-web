import { Plus } from "lucide-react";
import { Button } from "../__components/ui/button";
import OrderStatusView from "./OrderStatusView";
import CreateOrderForm from "./CreateOrderForm";

export default function OrderStatusViewPage() {
  return (
    <div className="grid grid-rows-[auto_1fr] h-full min-h-dvh px-6">
      <header className="pt-12">
        <h1 className="scroll-m-20 mb-6 text-center text-4xl font-extrabold tracking-tight text-balance">
          Tus pedidos
        </h1>
      </header>
      <main className="w-full max-w-2xl justify-self-center h-full grid grid-rows-[1fr_auto]">
        <OrderStatusView />

        <CreateOrderForm>
          <Button
            className="sticky ml-auto bottom-12 rounded-full p-0 size-fit aspect-square"
            title="Abrir formulario de crear orden"
          >
            <Plus className="size-6" />
          </Button>
        </CreateOrderForm>
      </main>
    </div>
  );
}
