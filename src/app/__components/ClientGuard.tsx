import { isAdmin } from "@/features/actions/ClientsController.actions";
import { redirect } from "next/navigation";

export default async function ClientGuard({
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

  if (isAdminRes.data) {
    redirect("/admin");
  }

  return <>{children}</>;
}
