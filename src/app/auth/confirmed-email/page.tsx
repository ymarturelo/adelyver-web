"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/__components/ui/card";
import Lottie from "lottie-react";

import confetti from "@/app/__assets/lottie/confetti.json";
import Link from "next/link";
import { Button } from "@/app/__components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ConfirmedEmailPage() {
  return (
    <div className="grid place-items-center h-dvh py-8 px-8 w-full">
      <div>
        <header className="mb-16 text-center max-w-3xl w-full">
          <h1 className="text-h1 mb-4">¡Todo listo, Bienvenido!</h1>
          <p className="text-lead">
            Tu cuenta ha sido verificada exitosamente.
          </p>
        </header>

        <main className="w-full max-w-3xl grid justify-center gap-8">
          <Lottie
            className="[&_.secondary]:stroke-foreground [&_.primary]:stroke-ring grid [&>svg]:size-full h-48"
            animationData={confetti}
            loop={false}
          />
          <Button variant="link" asChild className="p-0 px-0 flex">
            <Link
              className="hover:underline underline-offset-2"
              href="/dashboard"
            >
              Haz click aquí para dirigirte a tu panel de control <ArrowRight />
            </Link>
          </Button>
        </main>
      </div>
    </div>
  );
}
