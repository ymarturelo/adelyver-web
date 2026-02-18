import { getClientOrderProductsAction } from "@/features/actions/OrdersController.actions";
import { useQuery } from "@tanstack/react-query";

export default function useGetClientOrderProducts(
  orderId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["orders", orderId, "products"],
    queryFn: async () => {
      const res = await getClientOrderProductsAction(orderId);

      if (res.ok) {
        return res.data;
      }

      switch (res.error.code) {
        default:
          throw new Error(`${res.error.code}: ${res.error.message}`);
      }
    },
    enabled,
  });
}
