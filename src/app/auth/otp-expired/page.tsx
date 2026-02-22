"use client";
import { Button } from "@/app/__components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OtpExpiredPage() {
  return (
    <header className="grid place-content-center text-center gap-4 justify-items-center h-dvh">
      <h1 className="text-h1">Link de verificación expirado</h1>
      <p className="text-lead max-w-[40ch]">
        Prueba a logearte de nuevo. Si el problema persiste, comunícate con el
        administrador.
      </p>
      <Button variant="link" asChild className="p-0 px-0">
        <Link href="/auth/login">
          Volver a autenticarse
          <ArrowRight />
        </Link>
      </Button>
    </header>
  );
}
