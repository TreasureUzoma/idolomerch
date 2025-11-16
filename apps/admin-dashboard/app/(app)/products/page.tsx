"use client";

import React from "react";
import { useGetAllProducts } from "@/hooks/use-products";
import { ErrorPage } from "@/components/error-page";
import { Skeleton } from "@workspace/ui/components/skeleton";
import Link from "next/link";

export default function ProductsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetAllProducts();

  if (error) return <ErrorPage error={error} />;

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl mb-4">Products</h1>
      {isLoading ? (
        <div className="grid-cols-3 gap-5 grid">
          {Array.from({ length: 6 }, (_, i) => i + 1).map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div>No products found</div>
      ) : (
        <ul className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="border p-2 rounded">
              <Link href={product.id}>
                <img src={product.mainImage} className="w-14 h-14" />
                {product.name}
              </Link>

              <div className="flex items-center justify-start">
                <Link href={`/products/edit/${product.id}`}>edit</Link>
                <div>delete</div>
              </div>
            </div>
          ))}
        </ul>
      )}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
