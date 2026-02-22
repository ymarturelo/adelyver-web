import { Button } from "@/app/__components/ui/button";
import RegisterForm from "./RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="grid justify-items-center py-8 px-8 w-full">
      <header className="mb-16 text-center max-w-3xl w-full">
        <h1 className="text-h1 mb-4">Regístrate</h1>
        <p className="text-lead">
          Obtén acceso a nuestra plataforma sin tener que interactuar con un
          administrador.
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <RegisterForm />
        <p className="text-center text-sm mt-4">
          ¿Ya tienes cuenta?{" "}
          <Button variant="link" className="p-0 px-0">
            <Link href="/auth/login">Inicia sesión</Link>
          </Button>
        </p>
      </main>
    </div>
  );
}
