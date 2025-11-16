"use client";

import React from "react";
import Link from "next/link";
import { useLogout, useSession } from "@/hooks/session";
import { LogOut } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Skeleton } from "@workspace/ui/components/skeleton";

type SidebarHeaderProps = {
  children?: React.ReactNode;
  onLogout?: () => void;
};

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  onLogout,
}) => {
  const { data: session, isLoading } = useSession();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    if (onLogout) return onLogout();
    logout();
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 border flex flex-col justify-between">
        <nav className="mt-10">
          <ul className="space-y-4 px-6">
            <li>
              <Link href="/products" className="hover:text-muted-foreground">
                Products
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-muted-foreground">
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/products/new"
                className="hover:text-muted-foreground"
              >
                Create Product
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mb-6 px-6">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full py-2 text-red-500 rounded hover:text-red-700 flex items-center justify-center gap-2"
          >
            Logout <LogOut className="scale-80" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-end border h-16 px-6 shadow">
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Skeleton className="w-[12rem]" />
            ) : (
              <span>Hello, {session?.name}</span>
            )}
            {isLoading ? (
              <Skeleton className="rounded-full w-9 h-9" />
            ) : (
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${session?.id}`} />
                <AvatarFallback>I</AvatarFallback>
              </Avatar>
            )}
          </div>
        </header>

        <main className="flex-1 p-7 overflow-auto">{children}</main>
      </div>
    </div>
  );
};
