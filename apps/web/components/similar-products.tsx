"use client";

import React from "react";
import { Product } from "@repo/ui/types/product";
import { ProductCard } from "./product-card";

type SimilarProductsProps = {
  currentProduct: Product;
  allProducts: Product[];
  exchangeRate: number | null; // ✅ Add this prop
};

export const SimilarProducts = ({
  currentProduct,
  allProducts,
  exchangeRate,
}: SimilarProductsProps) => {
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

  return (
    <div className="py-12 px-4 md:px-[5rem]">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {related.length ? "Similar Products" : "You May Also Like"}
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 md:gap-y-9 gap-x-5 md:gap-x-6">
        {productsToShow.map((item) => (
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
