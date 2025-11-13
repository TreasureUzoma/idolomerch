"use client";

import React, { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { CurrencyDropdown } from "./currency-dropdown";
import { useCartStore } from "@/store/cart";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCartStore();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refunds Policy", href: "/refunds-policy" },
    { label: "Contact", href: "https://x.com/idolodev" },
  ];

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 p-4 md:px-8 shadow-sm bg-background">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <button onClick={() => setMenuOpen(true)} className="text-foreground">
          <Menu size={25} />
        </button>

        <Link href="/" className="font-semibold text-primary">
          idolomerch
        </Link>

        <Link href="/cart" className="relative inline-block">
          <ShoppingBag size={25} className="text-foreground" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.625rem] font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div
        data-open={menuOpen}
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 data-[open=false]:opacity-0 data-[open=false]:pointer-events-none"
      />

      <div
        data-open={menuOpen}
        className="fixed top-0 left-0 z-50 h-full w-64 transform bg-background p-6 shadow-md transition-transform duration-300 data-[open=false]:-translate-x-full"
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute right-4 top-4"
        >
          <X size={24} />
        </button>

        <nav className="mt-12 flex flex-col gap-6 font-medium text-muted-foreground">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="transition-colors hover:text-primary"
            >
              {label}
            </Link>
          ))}
          <CurrencyDropdown />
        </nav>
      </div>
    </header>
  );
};
