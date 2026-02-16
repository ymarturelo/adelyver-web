"use client";
import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../__components/ui/accordion";
import { Separator } from "../../__components/ui/separator";
import useFindOrdersQuery from "@/queries/useFindOrdersQuery";
import { Spinner } from "../../__components/ui/spinner";

type ClientInfoSummaryProps = {
  name: string;
  phone: string;
  createdAt: Date;
  email?: string;
  children?: ReactNode;
};

export default function ClientInfoSummary({
  name,
  phone,
  createdAt,
  email,
  children,
}: ClientInfoSummaryProps) {
  const ordersQuery = useFindOrdersQuery({
    ignoreCancelled: false,
    ignoreDelievered: false,
    clientNumber: phone,
  });

  if (ordersQuery.isError) {
    return <p>Ha ocurrido un error de tipo: {ordersQuery.error.message}</p>;
  }

  return (
    <>
      <Accordion type="single" collapsible className="max-w-lg">
        <AccordionItem value={phone.toString()} className="border-none">
          <div className="">
            <AccordionTrigger className="[&>svg]:h-6 [&>svg]:w-6 w-[100%] text-gray-400 hover:no-underline hover:text-primary transition-colors">
              <div className="text-left">
                <div className="flex items-baseline gap-x-2">
                  <h2 className="text-xl font-semibold text-foreground truncate max-w-xs">
                    {name}
                  </h2>
                  <span className="text-sm font-medium text-muted-foreground shrink-0">
                    ({phone})
                  </span>
                </div>
                <p className="font-light text-sm">
                  creado el{" "}
                  {createdAt.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "numeric",
                    year: "2-digit",
                  })}
                </p>
                <p className="font-light text-sm">({email})</p>
                {ordersQuery.isSuccess ? (
                  <p className="font-light text-sm">
                    {ordersQuery.data.length} pedidos en total
                  </p>
                ) : (
                  <Spinner />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>{children}</AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
      <Separator></Separator>
    </>
  );
}
