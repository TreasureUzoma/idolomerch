"use client";

import { baseUrl } from "@/constants";
import ProductForm from "@/components/product-form";

export default function CreateProductPage() {
  const handleCreate = async (data: any) => {
    const res = await fetch(`${baseUrl}/upload-product`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      alert("Product created!");
    } else {
      alert(result.error || "Failed to create product");
    }
  };

  return (
    <div className="p-6">
      <h1>Create Product</h1>
      <ProductForm mode="create" onSubmit={handleCreate} />
    </div>
  );
}
