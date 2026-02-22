import { isAdmin } from "@/features/actions/ClientsController.actions";
import { ArrowRight, ShieldX } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default async function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdminRes = await isAdmin();

  if (!isAdminRes.ok) {
    return (
      <header className="grid place-content-center text-center gap-4 justify-items-center h-dvh">
        <h1 className="text-h1">Problemas obteniendo permisos</h1>
        <p className="text-lead max-w-[40ch]">
          Por favor prueba a recargar la página o comunícate con el
          administrador.
        </p>
        <p>
          Detalles: {isAdminRes.error.message} {isAdminRes.error.code}
        </p>
      </header>
    );
  }

  if (!isAdminRes.data) {
    return (
      <header className="grid place-content-center text-center gap-4 justify-items-center h-dvh">
        <ShieldX size={128} className="text-destructive mb-4" />
        <h1 className="text-h1">No tienes permisos</h1>
        <p className="text-lead max-w-[40ch] w-fit mb-4">
          Para acceder a esta página debes ser administrador.
        </p>
        <Button variant="link" asChild>
          <Link href="/auth/login">
            Volver a autenticarse
            <ArrowRight />
          </Link>
        </Button>
      </header>
    );
  }

  return <>{children}</>;
}
