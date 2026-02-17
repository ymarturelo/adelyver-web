import Login from "./Login";

export default function LoginPage() {
  return (
    <div className="min-h-dvh place-items-center py-20 w-full">
      <header className="mb-16 text-center max-w-3xl px-8 w-full">
        <h1 className="text-h1">Iniciar sesión</h1>
        <p className="text-lead"> Inserta tus datos para obtener acceso</p>
      </header>
      <main className="h-fit max-w-3xl w-full px-8">
        <Login />
      </main>
    </div>
  );
}
