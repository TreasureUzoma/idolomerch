import type React from "react";
import Image from "next/image";
import Link from "next/link";
import numeral from "numeral";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { name, price, currency, mainImage, slug } = product;

  return (
    <Link href={`/products/${slug}`} className="block group">
      <div className="relative w-full aspect-square">
        <Image
          src={mainImage}
          alt={name}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 bg-accent overflow-hidden rounded-3xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-4 flex flex-col gap-1 text-center text-sm text-foreground">
        <h3 className="text-sm line-clamp-2">{name}</h3>

        <div className="flex items-baseline gap-1 justify-center">
          <span>{currency}</span>
          <span>{numeral(price).format("0,0.00")}</span>
        </div>
      </div>
    </Link>
  );
};
