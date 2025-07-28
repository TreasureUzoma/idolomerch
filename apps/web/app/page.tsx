import { Hero } from "@/components/hero";
import Products from "@/components/products";
import { baseUrl } from "@/constants";

export default async function Home({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const search = searchParams.search || "";

  let products = [];

  try {
    const url = search
      ? `${baseUrl}/products?search=${encodeURIComponent(search)}`
      : `${baseUrl}/products`;
    const res = await fetch(url);
    console.log(res);

    if (!res.ok) throw new Error("Failed to fetch products");
    products = await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <Products products={products} />
    </div>
  );
}
