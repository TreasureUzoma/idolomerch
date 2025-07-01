"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  onAddToCart,
}) => {
  return (
    <div>
      <Link href={`/product/${id}`}>
        <div className="relative w-full h-[180px] rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-3 flex flex-col h-[110px]">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${id}`}>
            <h3 className="text-sm font-semibold line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>
          <button
            onClick={onAddToCart}
            className="text-primary bg-primary bg-opacity-10 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-primary hover:text-white transition"
            aria-label="Add to Cart"
          >
            +
          </button>
        </div>
        <p className="text-sm font-medium text-gray-900">
          USD {price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
