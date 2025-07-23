import { SidebarWithBottomNav } from "@/components/sidebar";
import { SessionsProvider } from "@/providers/session";

export default function ApptLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionsProvider>
      <div>
        <SidebarWithBottomNav>{children}</SidebarWithBottomNav>
      </div>
    </SessionsProvider>
  );
}
