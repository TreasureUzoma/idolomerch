import { Pagination } from "@/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
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
  price: number;
  discount: number;
  stockQuantity: number;
  shortDescription: string;
  currency: "USD";
  createdAt: string;
  updatedAt: string;

  description?: string;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  status?: "active" | "draft" | "archived";
  visibility?: "public" | "private";
  inventoryTracking?: boolean;
  lowStockThreshold?: number;
  dropDate?: string | null;
  weight?: number | null;
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

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: ProductUpdateInput & { id: string }) => {
      return api.put(`/admin/products/${body.id}`, body);
    },
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

export const useGetProductById = (id: string) => {
  return useQuery<ProductUpdateInput>({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data: res } = await api(`/admin/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};
