"use client";

import { useEffect, useState } from "react";
import productData from "@/data/dummy-products.json";
import type { Metadata } from "next";
import { ProductHeader } from "@/components/product-header";
import { ProductDetails } from "@/components/product-details";
import { Product } from "@repo/ui/types/product";
import { SimilarProducts } from "@/components/similar-products";
import { useCurrency } from "@/context/currency";
import { convertCurrency } from "@repo/ui/lib/currency";

type Props = {
  params: { id: string };
};

const getProductById = (id: string): Product | undefined =>
  productData.find((p) => p.id === id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductById(params.id);

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

export default function Page({ params }: Props) {
  const product = getProductById(params.id);
  const { currency } = useCurrency();

  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchRate = async () => {
      try {
        const rate = await convertCurrency(1, currency, "USD");
        if (!cancelled) setExchangeRate(rate);
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
      }
    };

    fetchRate();
    return () => {
      cancelled = true;
    };
  }, [currency]);

  if (!product) {
    return (
      <div className="py-7 px-4 md:px-[5rem] mb-7">
        <h2 className="text-xl font-bold mb-6">Product Not Found</h2>
      </div>
    );
  }

  return (
    <div>
      <ProductHeader title={product.title} />
      <ProductDetails product={product} exchangeRate={exchangeRate} />
      <SimilarProducts
        currentProduct={product}
        allProducts={productData}
        exchangeRate={exchangeRate}
      />
    </div>
  );
}
