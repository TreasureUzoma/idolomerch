import { SidebarWithBottomNav } from "@/components/sidebar"

export default function ApptLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <SidebarWithBottomNav>
        {children} 
        </SidebarWithBottomNav>
    </div>
  );
}