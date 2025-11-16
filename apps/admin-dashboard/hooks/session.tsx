import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@workspace/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSession = () => {
  const router = useRouter();

  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const { data: res } = await api("/admin/session");

        if (res?.message.includes("Unauthorized") || res?.status === "error") {
          router.push("/login");
          return null;
        }

        return res.data;
      } catch (err) {
        router.push("/login");
        return null;
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => api.post("/admin/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      toast.success("Logged out successfully!");
      router.push("/login");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err?.message : "Failed to logout");
    },
  });
};
