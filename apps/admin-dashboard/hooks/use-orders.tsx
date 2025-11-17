import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@workspace/axios";
import type {
  AdminOrderUpdateInput,
  ProductsParams as OrdersParam,
} from "@workspace/validations";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { toast } from "sonner";

export const useGetAllOrders = (params?: OrdersParam) => {
  const debouncedSearch = useDebounce(params?.search ?? "", 500);
  return useInfiniteQuery({
    queryKey: ["orders", { ...params, search: debouncedSearch }],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = {
        ...params,
        search: debouncedSearch || undefined,
        page: pageParam,
      };

      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter(
          ([_, v]) => v !== undefined && v !== ""
        )
      );

      const { data: res } = await api.get("/admin/orders", {
        params: filteredParams,
      });
      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: AdminOrderUpdateInput;
    }) => api.put(`/admin/orders/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"], exact: false });
      toast.success("Order status updated successfully");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err?.message : "Failed to update order status"
      );
    },
  });
};
