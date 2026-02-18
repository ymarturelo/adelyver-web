import OrderAdminPanel from "./OrderAdminPanel";

export default function OrderAdminPanelPage() {
  return (
    <div className="min-h-dvh place-items-center py-10">
      <header className="px-8 mb-12">
        <h1 className="text-h3">Pedidos</h1>
      </header>
      <main className="grid px-8 w-full max-w-2xl">
        <OrderAdminPanel />
      </main>
    </div>
  );
}
