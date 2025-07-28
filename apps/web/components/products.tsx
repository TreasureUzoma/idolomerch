"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import { useCurrency } from "@/context/currency";
import { convertCurrency } from "@repo/ui/lib/currency";
import { ProductCardSkeleton } from "@repo/ui/components/product-card-skeleton";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface ProductsProps {
  products: Product[];
}

export default function Products({ products }: ProductsProps) {
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

  const isEmpty = !products || products.length === 0;

  return (
    <div className="py-7 px-4 md:px-[5rem] mb-7">
      <h2 className="text-xl font-bold mb-6">All Products</h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 md:gap-y-9 gap-x-5 md:gap-x-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="text-center text-gray-500 py-10">
          No products available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 md:gap-y-9 gap-x-5 md:gap-x-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              exchangeRate={exchangeRate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
