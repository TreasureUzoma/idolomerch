import { Products } from "@/components/products";
import { API_BASE_URL } from "@workspace/constants/";

export async function fetchProducts(
  currency: string,
  page: number,
  category?: string
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/products?page=${page}&currency=${currency}&caegory=${category}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currency = (params.currency as string) || "USD";
  const page = parseInt((params.page as string) || "1", 10);

  const products = await fetchProducts(currency, page);

  return (
    <div className="flex flex-col items-center justify-center">
      <Products
        products={products}
        currentCurrency={currency}
        title="All Products"
      />
    </div>
  );
}
