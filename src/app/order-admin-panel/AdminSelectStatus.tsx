import { OrderStatus } from "@/features/models/OrderModel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../__components/ui/select";

type AdminSelectStatusProps={
  value?:OrderStatus;
  onValueChange?:(value: OrderStatus) => void;
}

export default function AdminSelectStatus({value, onValueChange}:AdminSelectStatusProps) {
  return (
    <Select value= {value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Selecciona un estado" ></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
            <SelectLabel>Estados</SelectLabel>
            <SelectItem value="pending_review">Pendiente de revisión</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="waiting_for_payment">Esperando pago</SelectItem>
            <SelectItem value="delivered">Entregado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
