"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/context/currency";

interface Props {
  currencies?: string[];
}

const FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  NGN: "🇳🇬",
  GBP: "🇬🇧",
  CAD: "🇨🇦",
};

export const CurrencyDropdown: React.FC<Props> = ({
  currencies = ["USD", "EUR", "NGN", "GBP", "CAD"],
}) => {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<"bottom" | "top">("bottom");
  const [align, setAlign] = useState<"left" | "right">("left");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Positioning + outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open && buttonRef.current && dropdownRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      setPosition(
        btnRect.bottom + dropdownRect.height > viewportHeight ? "top" : "bottom"
      );

      setAlign(
        btnRect.left + dropdownRect.width > viewportWidth ? "right" : "left"
      );

      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="px-2 py-1 hover:bg-gray-100 flex items-center gap-1.5 min-w-[72px]"
      >
        <span>{FLAGS[currency]}</span>
        <span>{currency}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`absolute z-10 w-32 bg-white border rounded shadow-sm ${
            position === "top" ? "bottom-full mb-1" : "top-full mt-1"
          } ${align === "right" ? "right-0" : "left-0"}`}
        >
          {currencies.map((cur) => (
            <button
              key={cur}
              onClick={() => {
                setCurrency(cur);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                cur === currency ? "text-primary font-semibold" : ""
              }`}
            >
              <span>{FLAGS[cur]}</span>
              <span>{cur}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
