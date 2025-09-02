"use client";

import { baseUrl } from "@/constants";
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";


export function SessionsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

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

    const checkSession = async () => {
      try {
        const res = await fetch(`${baseUrl}/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.warn("Session invalid or expired.");
          router.replace("/login"); // 🚪 redirect to login
        }
      } catch (err) {
        console.error("Error checking session:", err);
        router.replace("/login");
      }
    };

    checkSession(); // verify session on mount

  }, [router]);

  return <>{children}</>;
}
