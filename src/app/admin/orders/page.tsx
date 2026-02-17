import OrderAdminPanel from "./OrderAdminPanel";

export default function OrderAdminPanelPage() {
  return (
    <>
      <header className="pt-10 px-8 mb-12">
        <h1 className="text-h3">Pedidos</h1>
      </header>
      <main className="grid px-8 min-h-dvh">
        <OrderAdminPanel />
      </main>
    </>
  );
}
