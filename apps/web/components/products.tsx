"use client";

import { ProductCard } from "./product-card";

type Product = {
  id: number;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
};

interface ProductsProps {
  products: Product[];
  currentCurrency: string;
  title?: string;
  limit?: number;
}

export const Products = ({
  products,
  currentCurrency,
  title = "Products",
}: ProductsProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-7xl">
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No products found or failed to fetch.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
