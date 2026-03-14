import { Button } from "@/app/__components/ui/button";
import ClientsAdminPanel from "./ClientsAdminPanel";
import Link from "next/link";
import { Filter } from "lucide-react";
import Navbar from "../Navbar";

export default function ClientsAdminPanelPage() {
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr]">
      <header className="px-8 mb-4 max-w-3xl self-center">
        <h1 className="text-h3">Clientes</h1>
      </header>
      <main className="grid grid-rows-[1fr_auto] w-full px-8 max-w-3xl">
        <ClientsAdminPanel />
        <Button
          className="sticky ml-auto bottom-12 rounded-full p-0 size-fit aspect-square"
          title="Abrir formulario de crear orden"
          asChild
        >
          <Link href="/admin/clients/search" title="Filtrar pedidos">
            <Filter className="size-6" />
          </Link>
        </Button>
      </main>
    </div>
  );
}
