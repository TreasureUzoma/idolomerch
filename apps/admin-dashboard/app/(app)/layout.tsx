import { WithAuth } from "@/components/auth-provider";
import { SidebarHeader } from "@/components/sidebar-header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <WithAuth />
      <SidebarHeader>{children}</SidebarHeader>
    </div>
  );
}
