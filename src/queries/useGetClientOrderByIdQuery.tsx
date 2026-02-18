import { getClientOrderByIdAction } from "@/features/actions/OrdersController.actions";
import { useQuery } from "@tanstack/react-query";

export default function useGetClientOrderByIdQuery(orderId: string) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const res = await getClientOrderByIdAction(orderId);

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
