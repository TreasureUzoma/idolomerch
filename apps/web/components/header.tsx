"use client";

import React, { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="py-4 sticky top-0 left-0 right-0 shadow-sm bg-white z-50">
      <div className="px-4 md:px-[5rem] flex items-center justify-between">
        {/* Menu Button */}
        <button onClick={() => setMenuOpen(true)} className="text-gray-700">
          <Menu size={25} />
        </button>

        {/* Logo */}
        <Link href="#" className="font-medium text-primary">
          idolomerch
        </Link>

        {/* Shopping Bag Icon */}
        <div className="relative inline-block">
          <ShoppingBag size={25} className="text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[0.625rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            2
          </span>
        </div>
      </div>

      {/* Slide-down Sidebar Menu */}
      {menuOpen && (
        <div className="fixed left-0 top-0 max-5xl -50 bg-white p-6 overflow-y-auto animate-slideDown">
          {/* Close Button */}
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 absolute top-4 right-4"
          >
            <X size={24} />
          </button>

          {/* Menu Items */}
          <nav className="mt-12 flex flex-col gap-5">
            <Link href="/" className="text-lg text-gray-800 font-semibold">
              Home
            </Link>
            <Link href="/shop" className="text-lg text-gray-800 font-semibold">
              Shop
            </Link>
            <Link href="/about" className="text-lg text-gray-800 font-semibold">
              About
            </Link>
            <Link
              href="/contact"
              className="text-lg text-gray-800 font-semibold"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
