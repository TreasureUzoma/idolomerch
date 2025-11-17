"use client";

import React, { useState } from "react";
import { useDeleteProductById, useGetAllProducts } from "@/hooks/use-products";
import { ErrorPage } from "@/components/error-page";
import { Skeleton } from "@workspace/ui/components/skeleton";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";

export default function ProductsPage() {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    productName: string;
  }>({
    id: "",
    productName: "",
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetAllProducts();
  const { mutateAsync: deleteProductAsync, isPending: isDeletingProduct } =
    useDeleteProductById();

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
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="w-full h-48 bg-muted overflow-hidden flex items-center justify-center">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {product.name}
                </CardTitle>

                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.isFeatured && <Badge>Featured</Badge>}
                  {product.status === "active" && (
                    <Badge variant="secondary">Active</Badge>
                  )}
                  {product.status === "draft" && (
                    <Badge variant="outline">Draft</Badge>
                  )}
                  {product.status === "archived" && (
                    <Badge variant="destructive">Archived</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {product.shortDescription}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold">${product.price}</span>
                  {product.discountPercentage && (
                    <Badge variant="destructive">
                      -{product.discountPercentage}%
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Stock: {product.stockQuantity}
                </div>
              </CardContent>

              <CardFooter className="flex items-center gap-2">
                <Link href={`/products/edit/${product.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full flex gap-2 items-center"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  className="flex gap-2 items-center"
                  onClick={() => {
                    setSelectedProduct({
                      id: product.id,
                      productName: product.name,
                    });
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeletingProduct ? "Deleting..." : "Delete"}
                </Button>
              </CardFooter>
            </Card>
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

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedProduct.productName} will be deleted permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeletingProduct}
              onClick={async () => {
                await deleteProductAsync(selectedProduct.id);
                setDeleteModalOpen(false);
                try {
                } catch {
                  //  hook already handles this (shows a toast) so this can be kept empty
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
