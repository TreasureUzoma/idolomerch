"use client";

import React, { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { CurrencyDropdown } from "./currency-dropdown";
import { useCart } from "@/context/cart";
export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refunds Policy", href: "/refunds-policy" },
    { label: "Contact", href: "https://x.com/idolodev" },
  ];

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="py-4 sticky top-0 left-0 right-0 shadow-sm bg-white z-50">
      <div className="px-4 md:px-[5rem] flex items-center justify-between">
        <button onClick={() => setMenuOpen(true)} className="text-gray-700">
          <Menu size={25} />
        </button>

        <Link href="/" className="font-semibold text-primary">
          idolomerch
        </Link>

        <Link href="/cart" className="relative inline-block">
          <ShoppingBag size={25} className="text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[0.625rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 p-6 shadow-md transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4"
        >
          <X size={24} />
        </button>

        <nav className="mt-12 flex flex-col gap-6 text-gray-800 font-medium">
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
