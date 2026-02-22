"use client";

import Lottie from "lottie-react";
import notificationLetter from "@/app/__assets/lottie/notification-letter.json";

export default function VerificationSentPage() {
  return (
    <div className="grid place-items-center h-dvh py-8 px-8 w-full">
      <div>
        <header className="mb-16 text-center max-w-3xl w-full">
          <h1 className="text-h1 mb-4">¡Casi listo! Revisa tu correo</h1>
          <p className="text-lead">Hemos enviado un enlace de verificación.</p>
        </header>

        <main className="w-full max-w-3xl grid justify-center gap-8">
          <Lottie
            className="[&_.secondary]:stroke-foreground [&_.primary]:stroke-ring grid [&>svg]:size-full h-48"
            animationData={notificationLetter}
            loop={false}
          />
        </main>
      </div>
    </div>
  );
}
