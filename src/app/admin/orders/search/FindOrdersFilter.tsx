"use client";

import { Button } from "@/app/__components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/__components/ui/field";
import { Input } from "@/app/__components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/__components/ui/popover";
import {
  FindOrdersFilterFormData,
  findOrdersFilterFormSchema,
} from "@/app/__schemas/findOrdersFilterForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import { Calendar } from "@/app/__components/ui/calendar";
import { CalendarIcon, Search } from "lucide-react";
import { Spinner } from "@/app/__components/ui/spinner";
import { Switch } from "@/app/__components/ui/switch";

export default function FindOrderFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FindOrdersFilterFormData>({
    resolver: zodResolver(findOrdersFilterFormSchema),
    defaultValues: {
      trackingNumber: searchParams.get("trackingNumber") ?? "",
      productId: searchParams.get("productId") ?? "",
      clientNumber: searchParams.get("clientNumber") ?? "",
      clientName: searchParams.get("clientName") ?? "",
      createdAfter: null,
      createdBefore: null,
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = (data: FindOrdersFilterFormData) => {
    const params = new URLSearchParams();
    if (data.trackingNumber) params.set("trackingNumber", data.trackingNumber);
    if (data.productId) params.set("productId", data.productId);
    if (data.clientNumber) params.set("clientPhone", data.clientNumber);
    if (data.clientName) params.set("clientName", data.clientName);

    if (data.createdAfter) {
      params.set("createdAfter", format(data.createdAfter, "yyyy-MM-dd"));
    }
    if (data.createdBefore) {
      params.set("createdBefore", format(data.createdBefore, "yyyy-MM-dd"));
    }

    router.push(`/admin/orders?${params.toString()}`);
  };

  return (
    <form
      id="find-orders-filter-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid grid-rows-auto"
    >
      <FieldGroup className="pb-2">
        <Controller
          name="trackingNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Número de seguimiento</FieldLabel>
              <Input type="text" {...field} value={field.value ?? ""} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="productId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Id del producto</FieldLabel>
              <Input type="text" {...field} value={field.value ?? ""} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="clientName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nombre del cliente</FieldLabel>
              <Input type="text" {...field} value={field.value ?? ""} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="clientNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Número del cliente</FieldLabel>
              <Input type="text" {...field} value={field.value ?? ""} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="createdBefore"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="date-picker-simple">
                Creado antes de :
              </FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="gap-2 data-[empty-true]:text-muted-foreground w-[212px] justify-between font-normal text-muted-foreground"
                  >
                    <span className="">
                      {field.value
                        ? format(field.value, "PP")
                        : "Seleccionar fecha"}
                    </span>
                    <CalendarIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                    defaultMonth={field.value ?? undefined}
                    disabled={(date) => date > new Date()}
                  ></Calendar>
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="createdAfter"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Creado después de:</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="gap-1 data-[empty-true]:text-muted-foreground w-[212px] justify-between font-normal text-muted-foreground"
                  >
                    <span className="">
                      {field.value
                        ? format(field.value, "PP")
                        : "Seleccionar fecha"}
                    </span>
                    <CalendarIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                    defaultMonth={field.value ?? undefined}
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="mt-15">
        <Controller
          control={form.control}
          name="ignoreDelivered"
          render={({ field }) => (
            <Field orientation={"horizontal"}>
              <Switch
                {...field}
                name="ignoreDelivered-checkbox"
                onCheckedChange={field.onChange}
                value={field.value ? "true" : "false"}
              />
              <FieldLabel
                htmlFor="ignoreDelivered-checkbox"
                className="text-sm"
              >
                Ignorar recogidos
              </FieldLabel>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="ignoreDelivered"
          render={({ field }) => (
            <Field orientation={"horizontal"}>
              <Switch
                {...field}
                name="ignoreDelivered-checkbox"
                onCheckedChange={field.onChange}
                value={field.value ? "true" : "false"}
              />
              <FieldLabel
                htmlFor="ignoreDelivered-checkbox"
                className="text-sm"
              >
                Ignorar entregados
              </FieldLabel>
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        className="sticky ml-auto bottom-12 rounded-full p-0 size-fit aspect-square"
        title="Encontrar pedido  "
      >
        {isSubmitting ? <Spinner /> : <Search className="size-6" />}
      </Button>
    </form>
  );
}
