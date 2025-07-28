"use client";

import { useTheme } from "next-themes";
import {
  Toaster as SonnerToaster,
  toast as sonnerToast,
  ToasterProps,
} from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group !border !border-2"
      toastOptions={{
        classNames: {
          success: "!text-green-800 border-green-200",
          error: "!text-red-800 !border-red-200",
          warning: "!text-yellow-800 !border-yellow-200",
          info: "!text-blue-800 !border-blue-200",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster, sonnerToast as toast };
