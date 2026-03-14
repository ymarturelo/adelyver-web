import {
  getClientStats,
  OrderStatus,
  OrderStatusValues,
} from "@/features/models/OrderModel";
import { Field, FieldError, FieldLabel } from "../../__components/ui/field";
import { Input } from "../../__components/ui/input";
import { Button } from "../../__components/ui/button";
import useFindOrdersQuery from "@/queries/useFindOrdersQuery";
import { Spinner } from "../../__components/ui/spinner";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import {
  updateClientNameData,
  updateClientNameSchema,
} from "../../__schemas/updateClientName.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "../../__lib/utils";
import { Check } from "lucide-react";

type ClientOrderStatsProps = {
  initialName: string;
  clientNumber: string;
};

export default function ClientOrderStats({
  initialName,
  clientNumber,
}: ClientOrderStatsProps) {
  const ordersQuery = useFindOrdersQuery({
    ignoreCancelled: false,
    ignoreDelievered: false,
    clientNumber,
  });

  const form = useForm<updateClientNameData>({
    resolver: zodResolver(updateClientNameSchema),
    defaultValues: {
      name: initialName,
    },
  });

  const onSubmit = async (data: updateClientNameData) => {
    if (ordersQuery.isError) {
      return (
        <p className="text-destructive">Error: {ordersQuery.error.message}</p>
      );
    }

    if (ordersQuery.isLoading || !ordersQuery.data) {
      return (
        <span className="flex gap-4 items-center">
          <Spinner />
          <span>Cargando estadísticas...</span>
        </span>
      );
    }
  };
  const stats = getClientStats(ordersQuery.data ?? []);
  const allOrders = ordersQuery.data ?? [];
  const activeOrders = allOrders.filter((o) => o.status !== "cancelled");

  const totalPaid = activeOrders.reduce(
    (sum, o) => sum + o.moneyPaidByClient,
    0
  );
  const totalDue = activeOrders.reduce(
    (sum, o) => sum + (o.spentMoney - o.moneyPaidByClient),
    0
  );
  const totalCancelled = allOrders
    .filter((o) => o.status === "cancelled")
    .reduce((sum, o) => sum + o.spentMoney, 0);

  return (
    <div className="">
      <form id="update-client-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nombre del cliente</FieldLabel>
              <Input
                {...field}
                type="text"
                id="update-client-form-name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-[1fr_auto] mt-4">
          {form.formState.isDirty && (
            <Button
              type="submit"
              className="col-start-2"
              form="update-client-form"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              <Spinner
                data-icon="inline-start"
                className={cn(!form.formState.isSubmitting && "hidden")}
              />
              <Check />
              Guardar cambios
            </Button>
          )}
        </div>
      </form>

      <div className="flex flex-col pt-6">
        <h4 className="bg-">Pedidos:</h4>
        {(Object.keys(OrderStatusValues) as OrderStatus[]).map((key) => (
          <div key={key}>
            <span>- {OrderStatusValues[key]}:</span>
            <span className="ml-2">{stats[key] || 0}</span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        {[
          { label: "Total pagado", value: totalPaid },
          {
            label: "Total por pagar",
            value: totalDue,
          },
          {
            label: "Total cancelado",
            value: totalCancelled,
          },
        ].map((item) => (
          <div key={item.label} className="flex justify-between   ">
            <span>{item.label}:</span>
            <span className={cn()}>${item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <Button asChild variant={"default"} className="w-[100%] mt-6">
        <Link
          href={`/admin/orders?clientNumber=${clientNumber}&clientName=${encodeURIComponent(
            initialName
          )}`}
        >
          Ver Pedidos
        </Link>
      </Button>
    </div>
  );
}
