import OrderDetails from "./OrderDetails";

export default function OrderDetailsPage() {
  return (
    <div>
      <header>
        <h1 className="sr-only">Pedido</h1>
      </header>
      <main className="w-full max-w-2xl justify-self-center h-full grid grid-rows-[1fr_auto]">
        <OrderDetails />
      </main>
    </div>
  );
}
