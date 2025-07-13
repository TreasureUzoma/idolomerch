"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@repo/ui/types/product";
import { ProductCard } from "./product-card";
import { useCurrency } from "@/context/currency";
import { convertCurrency } from "@repo/ui/lib/currency";

type SimilarProductsProps = {
  currentProduct: Product;
  allProducts: Product[];
};

export const SimilarProducts = ({
  currentProduct,
  allProducts,
}: SimilarProductsProps) => {
  const { currency } = useCurrency();
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchRate = async () => {
      try {
        const rate = await convertCurrency(1, currency, "USD");
        if (!cancelled) setExchangeRate(rate);
      } catch (err) {
        console.error("Currency conversion failed:", err);
        setExchangeRate(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRate();

    return () => {
      cancelled = true;
    };
  }, [currency]);

  const related = allProducts.filter(
    (p) =>
      p.id !== currentProduct.id &&
      p.tags.some((tag) => currentProduct.tags.includes(tag))
  );

  const getRandomProducts = (count: number) => {
    const eligible = allProducts.filter((p) => p.id !== currentProduct.id);
    const shuffled = [...eligible].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const productsToShow = related.length ? related : getRandomProducts(6);

  const SkeletonCard = () => (
    <div className="animate-pulse flex flex-col gap-3">
      <div className="w-full h-[180px] rounded-2xl bg-primary/20" />
      <div className="h-4 w-3/4 rounded bg-primary/20" />
      <div className="h-6 w-1/2 rounded-xl bg-primary/20" />
    </div>
  );

  return (
    <div className="py-12 px-4 md:px-[5rem]">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {related.length ? "Similar Products" : "You May Also Like"}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 md:gap-y-9 gap-x-5 md:gap-x-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : productsToShow.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                image={item.image}
                exchangeRate={exchangeRate}
              />
            ))}
      </div>
    </div>
  );
};
