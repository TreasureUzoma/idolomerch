import { Products } from "@/components/products";
import { API_BASE_URL } from "@workspace/constants/";

type Product = {
  id: number;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
};

async function fetchProducts(
  currency: string,
  page: number
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/products?page=${page}&currency=${currency}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currency = (params.currency as string) || "USD";
  const page = parseInt((params.page as string) || "1", 10);

  const products = await fetchProducts(currency, page);

  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-4 md:p-8">
      <Products
        products={products}
        currentCurrency={currency}
        title="All Products"
      />
    </div>
  );
}
