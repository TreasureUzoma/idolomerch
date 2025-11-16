import { Pagination } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@workspace/axios";
import { ProductCreateInput, ProductUpdateInput } from "@workspace/validations";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  mainImage: string;
  price: string | null;
  discount: number | null;
  stockQuantity: number;
  shortDescription: string;
  currency: "USD" | "EUR";
  createdAt: Date;
  updatedAt: Date;
}

interface ProductResponseData {
  data: Product[];
  meta: Pagination;
}

export const useGetAllProducts = () => {
  return useInfiniteQuery<ProductResponseData>({
    queryKey: ["products"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data: res } = await api(`/admin/products?page=${pageParam}`);
      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    initialPageParam: 1,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: ProductCreateInput) =>
      api.post("/admin/products", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      toast.success("Product created successfully");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err?.message : "Failed to create product"
      );
    },
  });
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: ProductUpdateInput) =>
      api.put(`/admin/products/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
      toast.success("Product updated successfully");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err?.message : "Failed to update product"
      );
    },
  });
};
