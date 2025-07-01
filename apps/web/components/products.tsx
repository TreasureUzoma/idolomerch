"use client";

import React from "react";
import { ProductCard } from "./product-card";
import productData from "../data/dummy-products.json";

export default function Products() {
  return (
    <div className="py-7 px-4 md:px-[5rem] mb-7">
      <h2 className="text-xl font-bold mb-6">Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productData.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            onAddToCart={() => console.log(`Add ${product.id} to cart`)}
          />
        ))}
      </div>
    </div>
  );
}
