import FindOrderFilter from "./FindOrdersFilter";

export default function FindOrderFilterPage() {
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr] py-10">
      <header className="px-8 mb-12 max-w-3xl">
        <h1 className="text-h3">Búsqueda de pedidos</h1>
      </header>
      <main className="grid grid-rows-[1fr_auto] px-8 max-w-3xl">
        <FindOrderFilter />
      </main>
    </div>
  );
}
