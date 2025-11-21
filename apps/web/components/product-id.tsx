"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { CartItem, useCartStore } from "@/store/cart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import numeral from "numeral";

interface ProductClientProps {
  product: Product;
}

export default function ProductId({ product }: ProductClientProps) {
  const { addToCart } = useCartStore();
  const images = [product.mainImage, ...(product.galleryImages || [])];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    console.log(product);
    handleAddToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.mainImage,
      currency: product.currency,
    });
  };

  const handleAddToCart = (item: CartItem) => {
    addToCart(item);
  };
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="pb-32 md:pb-10">
      <div className="w-full relative md:rounded-xl overflow-hidden bg-gray-100 aspect-square md:h-[450px]">
        <img
          src={images[currentIndex]}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-all"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="flex gap-3 mt-4 overflow-x-auto scrollbar-none">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "w-20 h-20 min-w-20 rounded-md overflow-hidden border shrink-0",
              currentIndex === i ? "border-black" : "border-transparent"
            )}
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div className="mt-8 px-2 md:px-0 md:max-w-2xl">
        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-muted-foreground mt-3">{product.description}</p>

        <p className="text-2xl font-semibold mt-4">
          {product.currency} {numeral(product.price).format("0,0.00")}
        </p>

        <p className="text-sm mt-1 capitalize text-muted-foreground">
          #{product.category} #{product.isFeatured ? "featured" : "Hot"}{" "}
          {product.requiresShipping && "#Shipping available"}
        </p>

        <div className="mt-6 flex items-center gap-4">
          <p className="text-sm font-medium">Qty:</p>
          <Select value={String(qty)} onValueChange={(v) => setQty(Number(v))}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Qty" />
            </SelectTrigger>

            <SelectContent>
              {[...Array(product.stockQuantity)].map((_, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden md:block mt-8">
        <Button className="w-full py-6 text-lg" onClick={handleAdd}>
          Add to Cart
        </Button>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t rounded-lg p-4 z-40">
        <Button onClick={handleAdd} className="w-full text-lg py-4">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
