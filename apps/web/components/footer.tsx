import React, { Suspense } from "react";
import Link from "next/link";
import { CurrencyDropdown } from "./currency-dropdown";
import { ModeToggle } from "./theme-toggle";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const Footer = () => {
  return (
    <footer className="w-full border-t py-6 px-4 md:px-[5rem] text-sm font-medium">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-x-4 flex items-center">
          <Link href="#" className="font-semibold text-primary">
            idolomerch
          </Link>
          <Suspense fallback={<Skeleton />}>
            <CurrencyDropdown />
          </Suspense>
          <div>
            <ModeToggle />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 md:gap-7 justify-center">
          <a
            href="https://idolo.dev"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Developer
          </a>
          <a
            href="https://github.com/treasureuzoma/idolomerch"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View Source
          </a>
          <a
            href="https://x.com/idolodev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            X
          </a>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/refunds-policy" className="hover:underline">
            Refunds Policy
          </Link>
        </div>

        <div className="text-xs">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="#" className="font-semibold text-primary">
            idolomerch
          </Link>
        </div>
      </div>
    </footer>
  );
};
