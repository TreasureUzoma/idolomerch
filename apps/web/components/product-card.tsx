"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/context/cart";
import { useCurrency } from "@/context/currency";
import { convertCurrency } from "@repo/ui/lib/currency";
import { formatCurrency } from "@repo/ui/lib/format-currency";


interface ProductCardProps {
  id: string;
  title: string;
  price: number; // Base price in USD
  image: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
}) => {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { currency } = useCurrency();

  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchConverted = async () => {
      try {
        const result = await convertCurrency(price, currency, "USD");
        if (!cancelled) setConvertedPrice(result);
      } catch (err) {
        console.error("Currency conversion error:", err);
      }
    };

    fetchConverted();

    return () => {
      cancelled = true;
    };
  }, [price, currency]);

  const handleAdd = () => {
    addToCart({
      id,
      name: title,
      price, // stored as USD; adjust if cart display needs conversion
      quantity: 1,
      image,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
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

      <div className="p-3 flex flex-col gap-2 -mt-2 md:mt-0">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${id}`} className="flex-1">
            <h3 className="text-sm font-semibold line-clamp-2 leading-snug">
              {title}
            </h3>
          </Link>

          <button
            onClick={handleAdd}
            className="md:hidden shrink-0 text-primary bg-primary bg-opacity-10 rounded-full w-[2.125rem] h-[2.125rem] flex items-center justify-center hover:bg-primary hover:text-white transition"
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
          {convertedPrice !== null
                ? `${formatCurrency(item.price, currency)}`
                : `${formatCurrency(totalAmount, currency)}`}
        </p>

        <button
          onClick={handleAdd}
          className="hidden md:flex items-center justify-center gap-1 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-xl px-4 py-2 transition"
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              Added
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};
