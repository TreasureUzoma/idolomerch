import { fetchProducts, HomePageProps } from "@/app/page";
import ProductId from "@/components/product-id";
import { Products } from "@/components/products";
import { API_BASE_URL } from "@workspace/constants";
import { notFound } from "next/navigation";

interface PageProps {
  params: { slug: string };
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
  console.log(data);
  return data.data || null;
}

export async function generateMetadata({ params }: PageProps) {
  const product = await fetchProduct(params.slug, "USD");

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

export default async function Page({
  params,
  searchParams,
}: HomePageProps & PageProps) {
  const filterParams = await searchParams;
  const currency = (filterParams.currency as string) || "USD";
  const page = parseInt((filterParams.page as string) || "1", 10);
  const product = await fetchProduct(params.slug, currency);

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
