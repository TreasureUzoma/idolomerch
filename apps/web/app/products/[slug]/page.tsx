import ProductId from "@/components/product-id";
import { Products } from "@/components/products";
import { fetchProducts } from "@/lib/fetch-products";
import { API_BASE_URL } from "@workspace/constants";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchProduct(
  slug: string,
  currency: string
): Promise<Product | null> {
  const res = await fetch(
    `${API_BASE_URL}/api/v1/products/${slug}?currency=${currency}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.data || null;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug, "USD");

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist",
    };
  }

  return {
    title: `${product.name} | Idolo Store`,
    description: product.shortDescription,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const filters = await searchParams;
  const currency = (filters.currency as string) || "USD";
  const page = parseInt((filters.page as string) || "1", 10);

  const product = await fetchProduct(slug, currency);
  if (!product) notFound();

  const products = await fetchProducts(currency, page);

  return (
    <div className="flex flex-col gap-5">
      <ProductId product={product} />
      <Products
        products={products}
        title="You might also like"
        currentCurrency={currency}
      />
    </div>
  );
}
