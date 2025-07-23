"use client";

import { baseUrl } from "@/constants";
import { useEffect, ReactNode } from "react";

const REFRESH_INTERVAL = 12 * 60 * 1000; // 12 minutes

export function SessionsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await fetch(`${baseUrl}/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Token refresh failed:", await res.text());
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
      }
    };

    refreshToken(); // refresh immediately on mount

    const interval = setInterval(refreshToken, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
