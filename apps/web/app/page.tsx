import { Products } from "@/components/products";
import { fetchProducts } from "@/lib/fetch-products";

interface HomePageProps {
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
