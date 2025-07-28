"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { baseUrl } from "@/constants";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  [key: string]: any;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = `${baseUrl}/products${search && `?search=${search}`}`;
    fetch(url, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [search]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirm) return;

    const res = await fetch(`${baseUrl}/delete-product/${id}`, {
      method: "delete",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">All Products</h1>

      <input
        type="text"
        placeholder="Search products..."
        className="w-full border border-background px-3 py-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 flex gap-4 shadow-sm"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{product.title}</h2>
                <p className="text-sm text-gray-500">
                  ${product.price?.toLocaleString()}
                </p>
                <div className="mt-2 flex gap-2">
                  <Link
                    href={`/products/edit/${product.id}`}
                    className="text-blue-600 underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
