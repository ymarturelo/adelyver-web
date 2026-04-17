"use client";
import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../__components/ui/accordion";
import { Separator } from "../../__components/ui/separator";

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
  return (
    <>
      <Accordion type="single" collapsible className="max-w-lg">
        <AccordionItem value={phone.toString()} className="border-none">
          <div className="">
            <AccordionTrigger className="[&>svg]:h-6 [&>svg]:w-6 w-[100%] hover:no-underline hover:text-primary transition-colors">
              <div className="text-left grid w-full">
                <div className="flex items-baseline gap-x-2">
                  <h2 className="text-xl font-semibold text-foreground max-w-xs">
                    {name}
                  </h2>
                  <span className="text-sm font-medium text-muted-foreground shrink-0 ml-auto">
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
              </div>
            </AccordionTrigger>
            <AccordionContent> {children}</AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
      <Separator />
    </>
  );
}
