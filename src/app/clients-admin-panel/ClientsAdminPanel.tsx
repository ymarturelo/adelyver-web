"use client";
import ClientInfoSummary from "./ClientInfoSummary";
import ClientOrderStats from "./ClientOrderStats";
import { Button } from "../__components/ui/button";
import { Plus } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../__components/ui/drawer";
import CreateUserForm from "./CreateUserForm";
import { useState } from "react";
import { Spinner } from "../__components/ui/spinner";
import useGetClients from "@/queries/useGetClientsQuery";
import { useSearchParams } from "next/navigation";

export default function ClientsAdminPanel() {
  const searchParams = useSearchParams();
  const clientsQuery = useGetClients({
    name: searchParams.get("name") ?? "",
    phone: searchParams.get("phone") ?? "",
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
    <>
      <div className="px-6 w-full max-w-2xl">
        <div>
          <h1 className="mb-5">Clientes</h1>
          {clientsQuery.data.map((client) => {
            return (
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
            );
          })}
        </div>
      </div>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="p-6 rounded-full ml-auto mr-2 mt-20"
            disabled={isSaving}
          >
            <Plus />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="">
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
              {isSaving && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Usuario
            </Button>
            <DrawerClose asChild>
              <Button variant="secondary">Atrás</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
