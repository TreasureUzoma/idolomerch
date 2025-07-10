"use client";

import React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

const mockCartItems = [
  {
    id: "1",
    name: "Black T-shirt",
    price: 29.99,
    quantity: 2,
    image: "/images/image.png",
  },
  {
    id: "2",
    name: "Hoodie",
    price: 49.99,
    quantity: 1,
    image: "/images/image.png",
  },
];

export default function CartPage() {
  const total = mockCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {mockCartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 border rounded-lg bg-muted/10"
          >
            <div className="relative w-20 h-20">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium">{item.name}</h2>
              <p className="text-sm text-muted-foreground">
                ${item.price.toFixed(2)} × {item.quantity}
              </p>
            </div>
            <button className="text-red-500 hover:text-red-700">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
        <button className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-black/80 transition">
          Checkout
        </button>
      </div>
    </div>
  );
}
