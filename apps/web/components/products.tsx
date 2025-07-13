"use client";

import React, { useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import productData from "../data/dummy-products.json";
import { useCurrency } from "@/context/currency";
import { convertCurrency } from "@repo/ui/lib/currency";

export default function Products() {
  const { currency } = useCurrency();
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchRate = async () => {
      try {
        const rate = await convertCurrency(1, currency, "USD"); // 1 USD → target currency
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

  return (
    <div className="py-7 px-4 md:px-[5rem] mb-7">
      <h2 className="text-xl font-bold mb-6">All Products</h2>

      {loading ? (
        <p className="text-muted-foreground">Loading prices...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 md:gap-y-9 gap-x-5 md:gap-x-6">
          {productData.map((product) => (
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
