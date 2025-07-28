import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductHeader } from "@/components/product-header";
import { ProductDetails } from "@/components/product-details";
import { SimilarProducts } from "@/components/similar-products";
import { Product } from "@repo/ui/types/product";
import { baseUrl } from "@/constants";

type Props = {
  params: { id: string };
};

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${baseUrl}/products/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch product", err);
    return null;
  }
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${baseUrl}/products`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch all products", err);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product does not exist.",
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function Page({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();

  return (
    <div>
      <ProductHeader title={product.title} />
      <ProductDetails product={product} />
      <SimilarProducts currentProduct={product} allProducts={allProducts} />
    </div>
  );
}
