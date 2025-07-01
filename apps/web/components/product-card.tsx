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
    <div className="h-[370px] rounded-xl overflow-hidden hover:shadow-sm transition-all duration-200">
      <Link href={`/product/${id}`}>
        <div className="relative w-full h-[245px]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col justify-between h-[130px]">
        <Link href={`/product/${id}`}>
          <h3 className="text-base font-semibold line-clamp-1">{title}</h3>
        </Link>
        <p className="text-sm font-medium text-gray-600 mt-1">
          ${price.toFixed(2)}
        </p>

        <button
          onClick={onAddToCart}
          className="mt-3 bg-primary text-white rounded-lg py-2 px-4 text-sm font-medium hover:bg-opacity-90 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
