import FindClientForm from "./FindClientForm";

export default function FindClientPage() {
  return (
    <main className="grid grid-rows-[1fr_auto] w-full px-8 max-w-3xl gap-7">
      <header className="px-8 max-w-3xl">
        <h1 className=" text-center text-h3">Clientes</h1>
      </header>
      <FindClientForm />
    </main>
  );
}
