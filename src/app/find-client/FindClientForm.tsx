"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FindClientFormData,
  findClientFormSchema,
} from "../__schemas/findClientForm.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../__components/ui/field";
import { Input } from "../__components/ui/input";
import { Button } from "../__components/ui/button";
import { Spinner } from "../__components/ui/spinner";
import { Search } from "lucide-react";

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

    router.push(`/clients-admin-panel?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-lg px-6 pb-6 grid grid-rows-[auto_1fr]">
      <h1 className="mb-5">Clientes</h1>
      <form
        id="find-client-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-rows-auto"
      >
        <FieldGroup className="pb-2">
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
                <Input type="number" {...field} value={field.value ?? ""} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <div className="flex justify-end mt-auto">
          <Button
            form="find-client-form"
            variant={"secondary"}
            type="submit"
            size={"icon-lg"}
            className="rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner /> : <Search className="" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
