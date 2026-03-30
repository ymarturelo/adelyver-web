"use client";
import { useRouter, useSearchParams } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import {
  FindClientFormData,
  findClientFormSchema,
} from "@/app/__schemas/findClientForm.schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/__components/ui/field";
import { Input } from "@/app/__components/ui/input";
import { Button } from "@/app/__components/ui/button";
import { Spinner } from "@/app/__components/ui/spinner";

export default function FindClientForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FindClientFormData>({
    resolver: zodResolver(findClientFormSchema),
    defaultValues: {
      name: searchParams.get("name") ?? "",
      phone: searchParams.get("phone") ?? "",
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: FindClientFormData) => {
    const params = new URLSearchParams();
    if (data.name) params.set("name", data.name);
    if (data.phone) params.set("phone", data.phone);

    router.push(`/admin/clients?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <form
        id="find-client-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-row[auto_1fr] h-full"
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nombre del cliente</FieldLabel>
                <Input type="text" {...field} value={field.value ?? ""} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Número de teléfono</FieldLabel>
                <Input type="text" {...field} value={field.value ?? ""} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <div className="flex justify-end items-end">
          <Button
            type="submit"
            className="sticky ml-auto bottom-12 rounded-full p-0 size-fit aspect-square"
            title="Encontrar cliente  "
          >
            {isSubmitting ? <Spinner /> : <Search className="size-6" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
