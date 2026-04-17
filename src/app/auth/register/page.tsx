import { Button } from "@/app/__components/ui/button";
import RegisterForm from "./RegisterForm";
import Link from "next/link";
import Logo from "@/app/__assets/PNG-0006.png";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="grid justify-items-center py-8 px-8 w-full max-w-xl md:mx-auto">
      <div className="relative size-6 mx-auto mt-5 mb-1">
        <Image src={Logo} alt="" className="absolute size-full scale-[6]" />
      </div>
      <header className="mb-8 text-center max-w-3xl w-full">
        <h1 className="text-h1 mb-4">Regístrate</h1>
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
