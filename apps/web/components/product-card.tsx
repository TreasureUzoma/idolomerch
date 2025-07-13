"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/context/cart";
import { useCurrency } from "@/context/currency";
import { formatCurrency } from "@repo/ui/lib/format-currency";

interface ProductCardProps {
  id: string;
  title: string;
  price: number; // Base price in USD
  image: string;
  exchangeRate: number | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  image,
  exchangeRate,
}) => {
  const { addToCart } = useCart();
  const { currency } = useCurrency();
  const [added, setAdded] = useState(false);

  const convertedPrice = exchangeRate !== null ? price * exchangeRate : price;

  const handleAdd = () => {
    addToCart({
      id,
      name: title,
      price, // still store USD
      quantity: 1,
      image: image || "/images/default.png",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div>
      <Link href={`/product/${id}`}>
        <div className="relative w-full h-[180px] rounded-2xl overflow-hidden">
          <Image
            src={image || "/images/default.png"}
            alt={title || "Product image"}
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
            {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-sm font-medium text-gray-900">
          {formatCurrency(convertedPrice, currency)}
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
