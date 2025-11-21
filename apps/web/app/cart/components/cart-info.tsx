"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import numeral from "numeral";

export default function CartInfo() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity } = useCartStore();

  const currency = cart[0]?.currency || "USD";

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id);
    toast.success(`${name} removed from cart`);
  };

  const handleQuantityChange = (id: string, newQty: number, name: string) => {
    updateQuantity(id, newQty);
    toast.success(`Updated ${name} to ${newQty}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 min-h-screen pb-32 md:pb-6">
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
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h2 className="text-lg font-medium">{item.name}</h2>

                  <p className="text-sm text-muted-foreground">
                    {item.currency} {numeral(item.price).format("0,0.00")}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          Math.max(1, item.quantity - 1),
                          item.name
                        )
                      }
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="px-2 text-sm">{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity + 1,
                          item.name
                        )
                      }
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemove(item.id, item.name)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-background border-t px-4 py-4 z-40 md:static md:bg-transparent md:border-none">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
              <p className="text-lg font-semibold">
                Total: {currency} {numeral(totalAmount).format("0,0.00")}
              </p>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full md:w-auto bg-black text-white text-base px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
