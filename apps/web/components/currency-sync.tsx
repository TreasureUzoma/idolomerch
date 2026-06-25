"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { API_BASE_URL } from "@workspace/constants";

export function CurrencySync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const storeCurrency = useCartStore((state) => state.currency);
  const setStoreCurrency = useCartStore((state) => state.setCurrency);

  const urlCurrency = searchParams.get("currency")?.toUpperCase();
  const prevCurrencyRef = useRef<string | null>(null);

  useEffect(() => {
    // 1. If URL has no currency query parameter, redirect/replace the URL with the store's currency.
    if (!urlCurrency) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("currency", storeCurrency || "USD");
      router.replace(`${pathname}?${params.toString()}`);
      return;
    }

    // 2. If the URL currency parameter changes and does not match the store currency, sync the store.
    if (urlCurrency !== storeCurrency && urlCurrency !== prevCurrencyRef.current) {
      prevCurrencyRef.current = urlCurrency;
      const syncRate = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/products/rates?to=${urlCurrency}`);
          const data = await res.json();
          if (data.status === "success" && typeof data.rate === "number") {
            setStoreCurrency(urlCurrency, data.rate);
          } else {
            setStoreCurrency(urlCurrency, 1);
          }
        } catch (err) {
          console.error("Failed to sync exchange rate to store:", err);
          setStoreCurrency(urlCurrency, 1);
        }
      };
      syncRate();
    }
  }, [urlCurrency, storeCurrency, pathname, router, searchParams, setStoreCurrency]);

  return null;
}
