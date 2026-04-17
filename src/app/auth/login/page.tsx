import { Button } from "@/app/__components/ui/button";
import Login from "./Login";
import Link from "next/link";
import Logo from "@/app/__assets/PNG-0006.png";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-dvh place-items-center py-20 w-full max-w-xl md:mx-auto">
      <div className="relative size-6 mx-auto mt-5 mb-1">
        <Image src={Logo} alt="" className="absolute size-full scale-[6]" />
      </div>
      <header className="mb-16 text-center max-w-3xl px-8 w-full">
        <h1 className="text-h1 mb-4">Iniciar sesión</h1>
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
