"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Analytics = dynamic(() => import("supametrics"), {
  ssr: false,
});

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <Analytics
        url="https://supametrics-go-server.onrender.com"
        client="supm_e720cde287b2cdc9f64e4d44a6696124"
      />
    </div>
  );
}
