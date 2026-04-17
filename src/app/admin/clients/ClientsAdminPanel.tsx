"use client";
import ClientInfoSummary from "./ClientInfoSummary";
import ClientOrderStats from "./ClientOrderStats";
import { Button } from "../../__components/ui/button";
import { Plus, SearchAlert } from "lucide-react";
import CreateUserForm from "./CreateUserForm";
import { Spinner } from "../../__components/ui/spinner";
import useGetClients from "@/queries/useGetClientsQuery";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/__components/ui/empty";
import { Skeleton } from "@/app/__components/ui/skeleton";

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

  if (clientsQuery.isError) {
    return <p>Ha ocurrido un error de tipo: {clientsQuery.error.message}</p>;
  }
  if (clientsQuery.isLoading || !clientsQuery.data) {
    const arr = Array.from({ length: 3 });
    return (
      <div className="flex flex-col gap-15 max-w-xl mt-20">
        {arr.map((_, index) => (
          <div
            key={`clients-skeletons-${index}`}
            className="flex items-center gap-4"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-30" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (clientsQuery.data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchAlert />
          </EmptyMedia>
          <EmptyTitle> Ningún cliente que mostrar</EmptyTitle>
          <EmptyDescription>
            {isFiltered
              ? "No se encontraron clientes que coincidan con la búsqueda."
              : "Aún no hay clientes registrados. Crea uno nuevo para comenzar."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {isFiltered ? (
            <div className="grid gap-4 mt-2">
              <Button
                variant="link"
                onClick={() => router.push("/admin/clients")}
                className=""
              >
                Ver todos los clientes
              </Button>
              <Button
                variant="default"
                onClick={() => router.push("/admin/clients/search")}
                className="rounded-lg"
              >
                Buscar clientes
              </Button>
            </div>
          ) : (
            <CreateUserForm>
              <Button title="Abrir formulario de crear cliente">
                Crear cliente
              </Button>
            </CreateUserForm>
          )}
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4 ">
      <CreateUserForm>
        <Button
          variant="secondary"
          className="w-fit ml-auto"
          title="Abrir formulario de crear orden"
        >
          <Plus className="size-6" /> Añadir cliente
        </Button>
      </CreateUserForm>
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
  );
}
