import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Create a product</h1>
      <ProductForm mode="create" />
    </div>
  );
}
