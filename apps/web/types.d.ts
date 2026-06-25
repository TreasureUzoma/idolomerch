type Product = {
  id: string;
  mainImage: string;
  galleryImages: string[];
  name: string;
  slug: string;
  price: number;
  usdPrice: number;
  stockQuantity: number;
  shortDescription: string;
  description?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  discountPercentage: number;
  requiresShipping: boolean;
  isFeatured: boolean;
};

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type DataResponse = {
  data: Product[];
  meta: Meta;
};

type ApiResponse = {
  status: "success" | "error";
  data: DataResponse;
};
