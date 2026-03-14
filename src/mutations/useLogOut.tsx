import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutAction } from "@/features/actions/ClientsController.actions";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const res = await logoutAction();

      if (!res.ok) {
        throw new Error(res.error?.message || "Error al cerrar sesión");
      }

      return res;
    },
    onSuccess: () => {
      queryClient.clear();

      toast.success("Sesión cerrada correctamente");

      router.replace("/auth/login");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
