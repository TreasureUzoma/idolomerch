"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@repo/ui/types/product";
import { useCart } from "@/context/cart";
import { Check } from "lucide-react";

export const ProductDetails = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(
    product.options.colors?.[0] ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>("M");
  const [quantity, setQuantity] = useState("1");
  const [added, setAdded] = useState(false);

  const displayedImage = selectedColor?.image ?? product.image;

  const handleAddToCart = () => {
    addToCart({
      id: product.id + (selectedColor?.name || "") + (selectedSize || ""),
      name: product.title,
      price: product.price,
      quantity: parseInt(quantity),
      image: displayedImage,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="py-3 px-4 md:px-[5rem] min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Product Image */}
        <div className="max-w-md w-full">
          <Image
            src={displayedImage}
            alt={product.title}
            width={500}
            height={500}
            className="rounded-2xl object-cover w-full h-auto"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {product.title}
            </h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Color Options */}
          {product.options.colors?.length ? (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Colors</p>
              <div className="flex gap-2">
                {product.options.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(color)}
                    className={`w-[45px] h-[45px] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedColor?.name === color.name
                        ? "border-primary"
                        : "border-gray-300"
                    }`}
                    aria-label={color.name}
                  >
                    <Image
                      src={color.image}
                      alt={color.name}
                      width={45}
                      height={45}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Size Options */}
          {product.options.sizes?.length ? (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Sizes</p>
              <div className="flex gap-2 flex-wrap">
                {product.options.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-1.5 rounded-md border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Quantity Select */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Quantity
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-[100px] border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {[...Array(10)].map((_, i) => {
                const val = (i + 1).toString();
                return (
                  <option key={val} value={val}>
                    {val}
                  </option>
                );
              })}
            </select>
          </div>

          {/* More Details */}
          {product.moreDetails?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Details
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                {product.moreDetails.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                Added to Cart
              </>
            ) : (
              <>Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
