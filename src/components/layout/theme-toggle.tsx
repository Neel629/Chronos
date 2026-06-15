"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { createClient } from "@/lib/supabase/client";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 cursor-pointer"
      onClick={async () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        
        // Update store and db if logged in
        const { preferences, setPreferences, profile } = useUserStore.getState();
        if (profile && preferences) {
          const newPrefs = { ...preferences, theme: newTheme as any };
          setPreferences(newPrefs);
          
          const supabase = createClient();
          await supabase.from("user_preferences").update({ theme: newTheme }).eq("user_id", profile.id);
        }
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  );
}
