"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Package, PlusSquare, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "@repo/ui/components/ui/sonner";
import { baseUrl } from "@/constants";

const navItems = [
  { name: "Home", href: "/", icon: <Home size={20} /> },
  { name: "Products", href: "/products", icon: <Package size={20} /> },
  { name: "New", href: "/products/new", icon: <PlusSquare size={20} /> },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export const SidebarWithBottomNav = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${baseUrl}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");
      toast.success("Logged out");
      router.push("/logout");
    } catch (err: any) {
      toast.error(err.message || "Logout failed");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 h-full w-64 flex-col bg-white shadow-sm px-4 py-6 z-10">
        <nav className="flex flex-col gap-4 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm flex items-center gap-3 text-background px-3 py-2 rounded-md hover:bg-gray-100 transition ${
                pathname === item.href
                  ? "bg-background/10 font-semibold"
                  : "font-medium"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="textt-sm mt-4 flex items-center gap-3 px-3 py-2 rounded-md transition text-red-500 hover:bg-red-50"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-2 shadow z-20">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center text-xs ${
              pathname === item.href
                ? "text-background font-medium"
                : "text-gray-500"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-xs text-red-500"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="md:ml-64 mb-16 md:mb-0 p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">
            {getGreeting()}, Treasure 👋
          </h1>
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
             src="https://avatar.vercel.sh/treasure"
             alt="Treasure Avatar"
             fill
             className="object-cover"
            />
          </div>

        </header>

        {children}
      </main>
    </>
  );
};
