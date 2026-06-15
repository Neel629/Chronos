"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Search, LogOut, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "./theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { useUserStore } from "@/stores/user-store";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
};

export function TopBar() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const profile = useUserStore((s) => s.profile);

  useEffect(() => {
    fetchNotifications();

    const supabase = createClient();
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchNotifications() {
    const supabase = createClient();
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
    }
  }

  async function markAsRead(id: string) {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    fetchNotifications();
  }

  async function markAllAsRead() {
    const supabase = createClient();
    // Assuming auth.uid() context will only update current user's notifications due to RLS
    await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
    fetchNotifications();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initial = profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || "U";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:px-6">
      {/* Left */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        
        <Popover>
          <PopoverTrigger
            className="flex h-9 w-9 items-center justify-center text-muted-foreground relative cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            )}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0 shadow-xl border-border/50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <h4 className="font-semibold text-sm">Notifications</h4>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-medium text-primary hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center">
                  <Bell className="h-8 w-8 mb-2 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 p-4 border-b border-border/30 transition-colors",
                        !n.is_read ? "bg-primary/[0.03]" : "opacity-70"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 h-2 w-2 rounded-full shrink-0",
                        !n.is_read ? "bg-primary" : "bg-transparent"
                      )} />
                      <div className="flex-1 space-y-1">
                        <p className={cn("text-sm", !n.is_read && "font-medium")}>
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {n.body}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground/60">
                          {new Date(n.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {!n.is_read && (
                        <button
                          onClick={() => markAsRead(n.id)}
                          className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent transition-colors cursor-pointer"
          >
            <Avatar className="h-7 w-7">
              {profile?.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt={profile.username || "User avatar"} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold uppercase">
                {initial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="cursor-pointer"
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
