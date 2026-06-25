"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import ReactCountryFlag from "react-country-flag";
import { useCartStore } from "@/store/cart";
import { API_BASE_URL } from "@workspace/constants";
import { toast } from "sonner";

interface Props {
  currencies?: string[];
}

const DEFAULT_CURRENCY = "USD";
const CURRENCY_PARAM_KEY = "currency";

const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "US",
  EUR: "EU",
  GBP: "GB",
  NGN: "NG",
  CAD: "CA",
  AUD: "AU",
  JPY: "JP",
  CNY: "CN",
  INR: "IN",
};

export const CurrencyDropdown = ({
  currencies = ["USD", "EUR", "NGN", "GBP", "CAD"],
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const storeCurrency = useCartStore((state) => state.currency);
  const setStoreCurrency = useCartStore((state) => state.setCurrency);

  // Fallback to query parameter if present, otherwise use global store currency
  const currentCurrency =
    searchParams.get(CURRENCY_PARAM_KEY)?.toUpperCase() || storeCurrency || DEFAULT_CURRENCY;

  const setCurrency = async (newCurrency: string) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/products/rates?to=${newCurrency}`);
      const data = await res.json();
      if (data.status === "success" && typeof data.rate === "number") {
        setStoreCurrency(newCurrency, data.rate);
      } else {
        throw new Error(data.error || "Failed to fetch conversion rate");
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error changing currency: ${err instanceof Error ? err.message : "Unknown error"}`);
      // Fallback: at least set the currency in the store without a rate
      setStoreCurrency(newCurrency, 1);
    } finally {
      setLoading(false);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set(CURRENCY_PARAM_KEY, newCurrency);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentCurrency} onValueChange={setCurrency} disabled={loading}>
      <SelectTrigger className="w-[110px] sm:w-[130px] font-medium transition-colors">
        <SelectValue placeholder={DEFAULT_CURRENCY}>
          <div className="flex items-center gap-2">
            <ReactCountryFlag
              countryCode={CURRENCY_TO_COUNTRY[currentCurrency] || "UN"}
              svg
              className="text-xl"
              title={currentCurrency}
            />
            <span>{currentCurrency}</span>
          </div>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {currencies.map((cur) => (
          <SelectItem key={cur} value={cur}>
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={CURRENCY_TO_COUNTRY[cur] || "UN"}
                svg
                className="text-lg"
                title={cur}
              />
              <span>{cur}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
