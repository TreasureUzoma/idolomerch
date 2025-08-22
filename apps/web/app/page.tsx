import { Hero } from "@/components/hero";
import Products from "@/components/products";
import { baseUrl } from "@/constants";
import { ServerWaker } from "@/components/server-waker";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rawSearch = params.search;
  const search = typeof rawSearch === "string" ? rawSearch : "";

  let products = [];

  try {
    const url = search
      ? `${baseUrl}/products?search=${encodeURIComponent(search)}`
      : `${baseUrl}/products`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch products");
    products = await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <Products products={products} />
      <ServerWaker />
    </div>
  );
}
