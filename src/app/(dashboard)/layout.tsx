"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-dvh bg-background">
      <Sidebar />

      {/* Main content area */}
      <div
        className={cn(
          "flex flex-col min-h-dvh transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          sidebarOpen ? "lg:pl-[240px]" : "lg:pl-[72px]"
        )}
      >
        <TopBar />
        <main className="flex-1 p-4 lg:p-6 pb-24 lg:pb-6">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}
