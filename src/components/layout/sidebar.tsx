"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  LayoutDashboard,
  Calendar,
  CheckSquare,
  BookOpen,
  BarChart3,
  Settings,
  Flame,
  ChevronLeft,
  Plus,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/stores/ui-store";

const navItems = [
  { href: "/today", label: "Today", icon: LayoutDashboard },
  { href: "/timetable", label: "Timetable", icon: Calendar },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/focus", label: "Focus", icon: Target },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const bottomNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setQuickAddOpen } = useUIStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-border/50 bg-sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/today" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0 transition-transform group-hover:scale-105 overflow-hidden">
              <img src="/logo.png" alt="Chronos Logo" className="h-full w-full object-cover" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-lg font-bold tracking-tight overflow-hidden whitespace-nowrap"
                >
                  Chronos
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 cursor-pointer"
            onClick={toggleSidebar}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                !sidebarOpen && "rotate-180"
              )}
            />
          </Button>
        </div>

        <Separator className="opacity-50" />

        {/* Quick Add */}
        <div className="px-3 mt-4">
          <Button
            onClick={() => setQuickAddOpen(true)}
            className={cn(
              "w-full shadow-lg shadow-primary/20 cursor-pointer",
              sidebarOpen ? "justify-start" : "justify-center px-0"
            )}
            size={sidebarOpen ? "default" : "icon"}
          >
            <Plus className="h-4 w-4 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2 overflow-hidden whitespace-nowrap"
                >
                  Quick Add
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  sidebarOpen ? "" : "justify-center px-0",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-0.5 h-5 rounded-r-full bg-primary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Streak Widget */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mx-3 mb-3 p-3 rounded-xl bg-streak/5 border border-streak/10"
            >
              <div className="flex items-center gap-2">
                <div className="text-xl animate-flame">🔥</div>
                <div>
                  <div className="text-sm font-bold">0 day streak</div>
                  <div className="text-[10px] text-muted-foreground">
                    Complete a task to start!
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Separator className="opacity-50" />

        {/* Bottom Nav */}
        <div className="px-3 py-3 space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  sidebarOpen ? "" : "justify-center px-0",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </div>
      </motion.aside>
    </>
  );
}
