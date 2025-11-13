"use client";

import React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import ReactCountryFlag from "react-country-flag";

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

  const currentCurrency =
    searchParams.get(CURRENCY_PARAM_KEY)?.toUpperCase() || DEFAULT_CURRENCY;

  const setCurrency = (newCurrency: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCurrency === DEFAULT_CURRENCY) {
      params.delete(CURRENCY_PARAM_KEY);
    } else {
      params.set(CURRENCY_PARAM_KEY, newCurrency);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentCurrency} onValueChange={setCurrency}>
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
