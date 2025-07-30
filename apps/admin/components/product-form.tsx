"use client";

import { useProductForm } from "@/hooks/use-product-form";
import { ImageIcon } from "lucide-react";

export default function ProductForm({
  mode,
  initialData,
  onSubmit,
}: {
  mode: "create" | "edit";
  initialData?: any;
  onSubmit: (formData: any) => Promise<void>;
}) {
  const form = useProductForm(initialData);

  const handleSubmit = async () => {
    form.setIsSubmitting(true);
    try {
      await onSubmit(form.getFormData());
      if (mode === "create") form.resetForm();
    } catch (err) {
      console.error("Submit error", err);
    } finally {
      form.setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-background px-6 py-4">
          <h2 className="text-2xl font-bold text-white">
            {mode === "edit" ? "Edit Product" : "Create New Product"}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InputField
                label="Product Title *"
                value={form.title}
                onChange={(e) => form.setTitle(e.target.value)}
                placeholder="Enter product title"
              />
              <InputField
                label="Category *"
                value={form.category}
                onChange={(e) => form.setCategory(e.target.value)}
                placeholder="e.g., Clothing, Electronics"
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Price *"
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    form.setPrice(parseFloat(e.target.value) || 0)
                  }
                />
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Currency
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    value={form.currency}
                    onChange={(e) => form.setCurrency(e.target.value)}
                  >
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Stock Quantity"
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    form.setStock(parseInt(e.target.value) || 0)
                  }
                />
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    value={form.status}
                    onChange={(e) => form.setStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="hot">Hot</option>
                    <option value="sale">Sale</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Main Product Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    form.handleMainImageUpload(e.target.files[0])
                  }
                  className="hidden"
                  id="main-image"
                />
                <label htmlFor="main-image" className="cursor-pointer">
                  {form.mainImage ? (
                    <img
                      src={form.mainImage}
                      alt="Main product"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="py-8">
                      <div className="text-4xl text-gray-400 mb-2 w-full flex items-center justify-center">
                        <ImageIcon />
                      </div>
                      <p className="text-gray-500">Click to upload main image</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
              value={form.description}
              onChange={(e) => form.setDescription(e.target.value)}
            />
          </div>

          {/* Tags / Sizes / Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Tags"
              value={form.tagInput}
              onChange={(e) => form.setTagInput(e.target.value)}
              placeholder="t-shirt, logo, cotton"
              helpText="Separate with commas"
            />
            <InputField
              label="Available Sizes"
              value={form.sizeInput}
              onChange={(e) => form.setSizeInput(e.target.value)}
              placeholder="S, M, L, XL"
              helpText="Separate with commas"
            />
            <InputField
              label="Care Instructions"
              value={form.detailInput}
              onChange={(e) => form.setDetailInput(e.target.value)}
              placeholder="Machine washable"
              helpText="Separate with commas"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Color Options
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter color name"
                value={form.newColorName}
                onChange={(e) => form.setNewColorName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && form.addColor()}
              />
              <button
                type="button"
                onClick={form.addColor}
                className="px-6 py-2 bg-background text-white rounded-lg"
              >
                Add Color
              </button>
            </div>

            {form.colors.map((color, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 mb-3"
              >
                <div className="flex justify-between mb-3">
                  <span className="font-medium text-gray-800 capitalize">
                    {color.name}
                  </span>
                  <button
                    onClick={() => form.removeColor(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      form.handleColorImageUpload(index, e.target.files[0])
                    }
                    className="text-sm"
                  />
                  {color.image && (
                    <img
                      src={color.image}
                      alt={color.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={form.isSubmitting}
              className={`w-full py-4 rounded-lg font-semibold text-lg shadow-lg transition-all ${
                form.isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-background text-white hover:bg-background/70"
              }`}
            >
              {form.isSubmitting
                ? "Submitting..."
                : mode === "edit"
                ? "Update Product"
                : "Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  helpText,
}: {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  helpText?: string;
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
    />
    {helpText && (
      <p className="text-xs text-gray-500 mt-1">{helpText}</p>
    )}
  </div>
);
