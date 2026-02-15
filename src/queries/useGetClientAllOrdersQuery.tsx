import { getClientAllOrdersAction } from "@/features/actions/OrdersController.actions";
import { useQuery } from "@tanstack/react-query";

export default function useGetClientAllOrders() {
  return useQuery({
    queryKey: ["client-orders"],
    queryFn: async () => {
      const res = await getClientAllOrdersAction();

      if (res.ok) {
        return res.data;
      }

      switch (res.error.code) {
        default:
          throw new Error(`${res.error.code}: ${res.error.message}`);
      }
    },
  });
}
