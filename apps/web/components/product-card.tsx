"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";

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
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (onAddToCart) onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1200); // show checkmark for 1.2s
  };

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
          <Link href={`/product/${id}`} className="flex-1">
            <h3 className="text-sm font-semibold line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>
          <button
            onClick={handleAdd}
            className="shrink-0 text-primary bg-primary bg-opacity-10 rounded-full w-[2.125rem] h-[2.125rem] flex items-center justify-center hover:bg-primary hover:text-white transition"
            aria-label="Add to Cart"
          >
            {added ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-sm font-medium text-gray-900">
          USD {price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};
