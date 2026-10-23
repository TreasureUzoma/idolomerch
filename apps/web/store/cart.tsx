"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number; // Price in the active currency
  basePrice: number; // Base price in USD
  quantity: number;
  image?: string;
  currency: string; // The currency at addition or last sync
};

type CartStore = {
  cart: CartItem[];
  currency: string;
  setCurrency: (currency: string, rate?: number) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create(
  persist<CartStore>(
    (set) => ({
      cart: [],
      currency: "USD",
      setCurrency: (newCurrency, rate = 1) =>
        set((state) => {
          const updatedCart = state.cart.map((item) => {
            // basePrice may be missing on carts persisted before it was introduced;
            // fall back to the item's existing price rather than producing NaN.
            const base = Number.isFinite(item.basePrice)
              ? item.basePrice
              : item.price;
            return {
              ...item,
              currency: newCurrency,
              price: Number.isFinite(base)
                ? Math.round(base * rate * 100) / 100
                : item.price,
            };
          });
          return {
            currency: newCurrency,
            cart: updatedCart,
          };
        }),

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((item) => (item.id === id ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as CartStore;
        return {
          ...state,
          cart: (state.cart ?? []).map((item) => ({
            ...item,
            // Backfill basePrice for carts persisted before it existed,
            // so currency switching doesn't produce NaN prices.
            basePrice: Number.isFinite(item.basePrice)
              ? item.basePrice
              : item.price,
          })),
        };
      },
    }
  )
);
