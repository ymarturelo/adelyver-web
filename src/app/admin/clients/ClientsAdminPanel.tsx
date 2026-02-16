"use client";
import ClientInfoSummary from "./ClientInfoSummary";
import ClientOrderStats from "./ClientOrderStats";
import { Button } from "../../__components/ui/button";
import { Plus, SearchAlert } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../__components/ui/drawer";
import CreateUserForm from "./CreateUserForm";
import { useState } from "react";
import { Spinner } from "../../__components/ui/spinner";
import useGetClients from "@/queries/useGetClientsQuery";
import { useRouter, useSearchParams } from "next/navigation";

export default function ClientsAdminPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const nameFilter = searchParams.get("name") ?? "";
  const phoneFilter = searchParams.get("phone") ?? "";
  const isFiltered = nameFilter !== "" || phoneFilter !== "";

  const clientsQuery = useGetClients({
    name: nameFilter,
    phone: phoneFilter,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (clientsQuery.isError) {
    return <p>Ha ocurrido un error de tipo: {clientsQuery.error.message}</p>;
  }
  if (clientsQuery.isLoading || !clientsQuery.data) {
    return (
      <span className="flex gap-4 items-center">
        <Spinner />
        <span>Cargando clientes...</span>
      </span>
    );
  }
  return (
    <div className="px-6 w-full max-w-2xl">
      <div>
        {clientsQuery.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg border border-dashed">
            <SearchAlert className="size-10" />
            <p className="text-center text-muted-foreground mt-6">
              {isFiltered
                ? "No se encontraron clientes que coincidan con la búsqueda."
                : "Aún no hay clientes registrados."}
            </p>
            {isFiltered && (
              <div className="grid gap-4 mt-2">
                <Button
                  variant="link"
                  onClick={() => router.push("/clients-admin-panel")}
                  className=""
                >
                  Ver todos los clientes
                </Button>
                <Button
                  variant="default"
                  onClick={() => router.push("/find-client")}
                  className="rounded-lg"
                >
                  Buscar clientes
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1 className="mb-5 text-2xl font-bold">Clientes</h1>
            <div className="flex flex-col gap-4 ">
              {clientsQuery.data.map((client) => (
                <ClientInfoSummary
                  key={client.phone}
                  name={client.fullName}
                  phone={client.phone}
                  createdAt={new Date(client.createdAt)}
                  email={client.email}
                >
                  <ClientOrderStats
                    clientNumber={client.phone}
                    initialName={client.fullName}
                  />
                </ClientInfoSummary>
              ))}
            </div>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild className="w-full flex">
                <Button
                  className="sticky ml-auto bottom-12 rounded-full p-0 size-fit aspect-square"
                  title="Abrir formulario de crear orden"
                >
                  <Plus className="size-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Crear Usuario</DrawerTitle>
                </DrawerHeader>
                <CreateUserForm
                  onSuccess={() => setIsOpen(false)}
                  onLoading={setIsSaving}
                ></CreateUserForm>
                <DrawerFooter>
                  <Button
                    type="submit"
                    form="create-user-form"
                    disabled={isSaving}
                    className="w-full"
                  >
                    {isSaving && (
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Guardar Usuario
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="secondary">Atrás</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        )}
      </div>
    </div>
  );
}
