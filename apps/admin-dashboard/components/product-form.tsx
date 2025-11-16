"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  Controller,
  SubmitHandler,
  Resolver,
  FormProvider,
} from "react-hook-form";

import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@workspace/ui/components/select";

import {
  productCreateSchema,
  productUpdateSchema,
  type ProductCreateInput,
  type ProductUpdateInput,
} from "@workspace/validations";

import { ErrorMessage } from "./error-message";
import {
  CustomImageInput,
  CustomGalleryImagesInput,
} from "./custom-image-upload";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { CATEGORIES, cleanNullValues } from "@/lib/utils";

type ProductFormProps = {
  mode: "create" | "update";
  defaultValues?: ProductCreateInput | ProductUpdateInput | undefined;
  onSubmitForm?: (data: ProductCreateInput | ProductUpdateInput) => void;
  isDataLoading?: boolean;
  id?: string;
};

export function ProductForm({
  mode,
  defaultValues,
  onSubmitForm,
  isDataLoading,
  id,
}: ProductFormProps) {
  const isCreate = mode === "create";

  const { mutate: createProduct, isPending: isCreatingProduct } =
    useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct();

  type FormValues = ProductCreateInput | ProductUpdateInput;

  const cleanedDefaultValues = defaultValues
    ? cleanNullValues(defaultValues)
    : {};

  const methods = useForm<FormValues>({
    resolver: zodResolver(
      isCreate ? productCreateSchema : productUpdateSchema
    ) as Resolver<FormValues>,
    defaultValues: {
      ...cleanedDefaultValues,
    } as unknown as FormValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (defaultValues) {
      const cleaned = cleanNullValues(defaultValues) as FormValues;
      methods.reset(cleaned);
    }
  }, [defaultValues, methods]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (Object.keys(errors).length > 0) {
      console.error("CLIENT-SIDE VALIDATION FAILED:");
      Object.entries(errors).forEach(([key, error]) => {
        console.error(`Field '${key}': ${error?.message}`);
      });
      return;
    }

    onSubmitForm?.(data);

    if (isCreate) {
      createProduct(data as ProductCreateInput);
    } else {
      if (!id) {
        throw new Error("Error: Product ID is missing for update operation.");
      }

      updateProduct({
        ...(data as ProductUpdateInput),
        id,
      } as ProductUpdateInput & { id: string });
    }
  };

  const isFormSubmitting = isCreatingProduct || isUpdatingProduct;
  const isDisabled = isDataLoading || isFormSubmitting;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input placeholder="Product name" {...methods.register("name")} />
          <ErrorMessage message={errors.name?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Slug</Label>
          <Input
            placeholder="product-name-slug"
            {...methods.register("slug")}
          />
          <ErrorMessage message={errors.slug?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Short Description</Label>
          <Input
            placeholder="A concise summary"
            {...methods.register("shortDescription")}
          />
          <ErrorMessage message={errors.shortDescription?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Detailed product description…"
            {...methods.register("description")}
          />
          <ErrorMessage message={errors.description?.message} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label>SKU</Label>
            <Input
              placeholder="Unique stock keeping unit"
              {...methods.register("sku")}
            />
            <ErrorMessage message={errors.sku?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Controller
              name="category"
              control={methods.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <ErrorMessage message={errors.category?.message} />
          </div>

          <CustomImageInput label="Main Image" name="mainImage" />
        </div>

        <CustomGalleryImagesInput label="Gallery Images" name="galleryImages" />

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Price ($)</Label>
            <Input
              type="number"
              placeholder="0.00"
              {...methods.register("price")}
            />
            <ErrorMessage message={errors.price?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Cost Price ($)</Label>
            <Input
              type="number"
              placeholder="0.00"
              {...methods.register("costPrice")}
            />
            <ErrorMessage message={errors.costPrice?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Currency</Label>
            <Controller
              name="currency"
              control={methods.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <ErrorMessage message={errors.currency?.message} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Stock Quantity</Label>
            <Input
              type="number"
              placeholder="0"
              {...methods.register("stockQuantity", { valueAsNumber: true })}
            />
            <ErrorMessage message={errors.stockQuantity?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Discount (%)</Label>
            <Input
              type="number"
              placeholder="0"
              {...methods.register("discountPercentage", {
                valueAsNumber: true,
              })}
            />
            <ErrorMessage message={errors.discountPercentage?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Low Stock Threshold</Label>
            <Input
              type="number"
              placeholder="5"
              {...methods.register("lowStockThreshold", {
                valueAsNumber: true,
              })}
            />
            <ErrorMessage message={errors.lowStockThreshold?.message} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-4">
          <div className="flex items-center gap-3">
            <Controller
              name="inventoryTracking"
              control={methods.control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label>Track Inventory</Label>
          </div>
          <div className="flex items-center gap-3">
            <Controller
              name="isFeatured"
              control={methods.control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label>Featured Product</Label>
          </div>
          <div className="flex items-center gap-3">
            <Controller
              name="requiresShipping"
              control={methods.control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label>Requires Shipping</Label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Status</Label>
          <Controller
            name="status"
            control={methods.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <ErrorMessage message={errors.status?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Visibility</Label>
          <Controller
            name="visibility"
            control={methods.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="unlisted">Unlisted</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <ErrorMessage message={errors.visibility?.message} />
        </div>

        <Button type="submit" className="w-fit" disabled={isDisabled}>
          {isDataLoading
            ? "Loading Product..."
            : isCreatingProduct
              ? "Creating..."
              : isUpdatingProduct
                ? "Updating..."
                : isCreate
                  ? "Create Product"
                  : "Update Product"}
        </Button>
      </form>
    </FormProvider>
  );
}
