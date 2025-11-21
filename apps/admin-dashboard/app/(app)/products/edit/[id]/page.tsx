"use client";
import { use } from "react";

import { ProductForm } from "@/components/product-form";
import { useGetProductById } from "@/hooks/use-products";
import { ErrorPage } from "@/components/error-page";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useGetProductById(id);
  if (error) return <ErrorPage error={error} />;
  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Edit Product: {data?.slug}</h1>
      <ProductForm
        mode="update"
        defaultValues={data}
        id={id}
        isDataLoading={isLoading}
      />
    </div>
  );
}
