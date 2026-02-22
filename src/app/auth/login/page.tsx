import { Button } from "@/app/__components/ui/button";
import Login from "./Login";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-dvh place-items-center py-20 w-full">
      <header className="mb-16 text-center max-w-3xl px-8 w-full">
        <h1 className="text-h1 mb-4">Iniciar sesión</h1>
        <p className="text-lead"> Inserta tus datos para obtener acceso</p>
      </header>
      <main className="h-fit max-w-3xl w-full px-8">
        <Login />
        <p className="text-center text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <Button variant="link" className="p-0 px-0">
            <Link href="/auth/register">Regístrate</Link>
          </Button>
        </p>
      </main>
    </div>
  );
}
