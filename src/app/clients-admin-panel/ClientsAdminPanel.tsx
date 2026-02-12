"use client";
import ClientInfoSummary from "./ClientInfoSummary";
import { getClientStats, OrderStatus } from "@/features/models/OrderModel";
import ClientOrderStats from "./ClientOrderStats";
import ButtonNavigation from "./ButtonNavigation";
import { Button } from "../__components/ui/button";
import { Plus, PlusIcon } from "lucide-react";
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

type ClientMock = {
  name: string;
  phone: number;
  createdAt: string;
  gmail: string;
  orders: { status: OrderStatus }[];
};

const clients: ClientMock[] = [
  {
    name: "Carlos",
    phone: 89874523,
    createdAt: "2026-02-11T10:00:00Z",
    gmail: "carlos@gmail.com",
    orders: [
      { status: "confirmed" },
      { status: "confirmed" },
      { status: "delivered" },
      { status: "pending_review" },
    ],
  },
  {
    name: "Pepe",
    phone: 53654789,
    createdAt: "2026-02-11T10:00:00Z",
    gmail: "pepe@gmail.com",
    orders: [
      { status: "confirmed" },
      { status: "confirmed" },
      { status: "delivered" },
      { status: "pending_review" },
      { status: "confirmed" },
      { status: "confirmed" },
      { status: "delivered" },
      { status: "pending_review" },
    ],
  },
  {
    name: "Manolo",
    phone: 56963254,
    createdAt: "2026-02-11T10:00:00Z",
    gmail: "pepe@gmail.com",
    orders: [
      { status: "confirmed" },
      { status: "confirmed" },
      { status: "delivered" },
      { status: "pending_review" },
      { status: "confirmed" },
      { status: "confirmed" },
      { status: "delivered" },
      { status: "pending_review" },
    ],
  },
];

export default function ClientsAdminPanel() {
  return (
    <>
      <div className="px-6 w-full max-w-2xl">
        <div>
          <h1 className="mb-5">Clientes</h1>
          {clients.map((client) => {
            const stats = getClientStats(client.orders);
            return (
              <ClientInfoSummary
                key={client.phone}
                name={client.name}
                phone={client.phone}
                createdAt={new Date(client.createdAt)}
                gmail={client.gmail}
                orderSummary={`${client.orders.length} pedidos totales`}
              >
                <ClientOrderStats initialName={client.name} stats={stats} />
              </ClientInfoSummary>
            );
          })}
        </div>
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="p-6 rounded-full ml-auto mr-2 mt-20"
          >
            <Plus />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="">
          <DrawerHeader>
            <DrawerTitle>Crear Usuario</DrawerTitle>
          </DrawerHeader>
          <CreateUserForm></CreateUserForm>
          <DrawerFooter>
            <Button type="submit" form="create-user-form" className="w-full">
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
