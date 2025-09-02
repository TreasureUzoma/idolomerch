"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { baseUrl } from "@/constants";
import ProductForm from "@/components/product-form";
import { toast } from "sonner";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`${baseUrl}/products`);
      const data = await res.json();
      const match = data.find((p: any) => p.id === id);
      setProduct(match);
    }
    fetchProduct();
  }, [id]);

  const handleUpdate = async (updated: any) => {
    const res = await fetch(`${baseUrl}/edit-product/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    const result = await res.json();
    if (res.ok) {
      toast("Product updated!");
    } else {
      toast.error(result.error || "Failed to update");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1>Edit Product</h1>
      <ProductForm mode="edit" initialData={product} onSubmit={handleUpdate} />
    </div>
  );
}
