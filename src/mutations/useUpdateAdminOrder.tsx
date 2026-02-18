import { UpdateOrderByAdminRequest } from "@/features/abstractions/IOrderController";
import { updateOrderByAdminAction } from "@/features/actions/OrdersController.actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: UpdateOrderByAdminRequest) => {
      const res = await updateOrderByAdminAction(req);

      if (!res.ok) {
        throw new Error(res.error?.message || "Error al actualizar el pedido");
      }

      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      console.error(err);
    },
  });
}
