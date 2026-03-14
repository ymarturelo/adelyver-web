import { isAuthenticated } from "@/features/actions/ClientsController.actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticatedRes = await isAuthenticated();

  if (!isAuthenticatedRes.ok) {
    return (
      <header className="grid place-content-center text-center gap-4 justify-items-center h-dvh">
        <h1 className="text-h1">Problemas obteniendo permisos</h1>
        <p className="text-lead max-w-[40ch]">
          Por favor prueba a recargar la página o{" "}
          <Button variant="link" asChild className="text-xl">
            <Link href="/auth/login">vuelve a autenticarte</Link>
          </Button>
        </p>
        <p>
          Detalles: {isAuthenticatedRes.error.message}{" "}
          {isAuthenticatedRes.error.code}
        </p>
      </header>
    );
  }

  if (!isAuthenticatedRes.data) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
