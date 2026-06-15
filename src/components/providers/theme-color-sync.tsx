"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/user-store";
import { useTheme } from "next-themes";

export function ThemeColorSync() {
  const preferences = useUserStore((s) => s.preferences);
  const { setTheme, theme: currentTheme } = useTheme();

  useEffect(() => {
    if (preferences?.accent_color) {
      const root = document.documentElement;
      // Overriding the CSS custom properties used by Tailwind
      root.style.setProperty("--primary", preferences.accent_color);
      root.style.setProperty("--brand", preferences.accent_color);
      root.style.setProperty("--ring", preferences.accent_color);
      root.style.setProperty("--sidebar-primary", preferences.accent_color);
      root.style.setProperty("--sidebar-ring", preferences.accent_color);
      root.style.setProperty("--chart-1", preferences.accent_color);
    } else {
      // Revert to defaults if none (by removing the inline styles)
      const root = document.documentElement;
      root.style.removeProperty("--primary");
      root.style.removeProperty("--brand");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--sidebar-primary");
      root.style.removeProperty("--sidebar-ring");
      root.style.removeProperty("--chart-1");
    }
  }, [preferences?.accent_color]);

  // Sync dark/light theme from preferences on load/update
  useEffect(() => {
    if (preferences?.theme && preferences.theme !== currentTheme) {
      setTheme(preferences.theme);
    }
  }, [preferences?.theme]);

  return null;
}
