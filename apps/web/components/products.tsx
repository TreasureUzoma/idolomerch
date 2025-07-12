"use client";

import React from "react";
import { ProductCard } from "./product-card";
import productData from "../data/dummy-products.json";

export default function Products() {
  return (
    <div className="py-7 px-4 md:px-[5rem] mb-7">
      <h2 className="text-xl font-bold mb-6">All Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-3 md:gap-y-9 gap-x-5 md:gap-x-6">
        {productData.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
