"use client";
/* eslint-disable */

import React, { createContext, useContext, useState, useEffect } from "react";

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "currency";
const DEFAULT_CURRENCY = "USD";

const countryToCurrency: Record<string, string> = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  FR: "EUR",
  DE: "EUR",
  CA: "CAD",
  AU: "AUD",
  IN: "INR",
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setCurrencyState(saved);
      return;
    }

    fetch("https://ipapi.co/json")
      .then((res) => res.json())
      .then((data) => {
        const countryCode = data?.country;
        const detectedCurrency = countryToCurrency[countryCode] || DEFAULT_CURRENCY;
        setCurrencyState(detectedCurrency);
        localStorage.setItem(LOCAL_STORAGE_KEY, detectedCurrency);
      })
      .catch((err) => {
        console.error("Geo IP lookup failed:", err);
        setCurrencyState(DEFAULT_CURRENCY);
      });
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem(LOCAL_STORAGE_KEY, newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
