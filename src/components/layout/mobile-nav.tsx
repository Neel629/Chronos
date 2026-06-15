"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  BarChart3,
  Plus,
  Trophy,
  Medal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";

const mobileNavItems = [
  { href: "/today", label: "Today", icon: LayoutDashboard },
  { href: "/timetable", label: "Table", icon: Calendar },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/analytics", label: "Stats", icon: BarChart3 },
  { href: "/leaderboard", label: "Rank", icon: Medal },
];

export function MobileNav() {
  const pathname = usePathname();
  const { setQuickAddOpen } = useUIStore();

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setQuickAddOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 active:scale-95 cursor-pointer"
        aria-label="Quick Add"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
