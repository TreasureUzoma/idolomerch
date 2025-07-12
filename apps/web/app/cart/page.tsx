"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/cart";
import { useCurrency } from "@/context/currency";
import { convertCurrency } from "@repo/ui/lib/currency";
// import { toast } from "sonner";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { currency } = useCurrency();

  const [convertedTotal, setConvertedTotal] = useState<number | null>(null);

  const totalUSD = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    convertCurrency(totalUSD, currency).then(setConvertedTotal);
  }, [cart, currency]);

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
   // toast.success(`${name} removed from cart`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border rounded-lg bg-muted/10"
              >
                <div className="relative w-20 h-20 shrink-0">
                  <Image
                    src={item.image || "/images/default.png"}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h2 className="text-lg font-medium">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    USD ${item.price.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="p-1 border rounded hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-2 text-sm">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border rounded hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemove(item.id, item.name)}
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="md:text-lg font-semibold">
              Total:{" "}
              {convertedTotal !== null
                ? `${currency} ${convertedTotal.toFixed(2)}`
                : `USD ${totalUSD.toFixed(2)}`}
            </p>
            <button className="mt-4 bg-primary text-white text-sm w-full px-6 py-2.5 rounded-md hover:bg-primary/90 transition">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
