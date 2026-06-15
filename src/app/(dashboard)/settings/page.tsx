"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Palette, Bell, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore, UserPreferences } from "@/stores/user-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { profile, preferences, setProfile, setPreferences, isLoading: storeLoading } = useUserStore();
  const { theme: currentTheme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const [formProfile, setFormProfile] = useState({
    full_name: "",
    username: "",
    institution: "",
  });

  const [formPrefs, setFormPrefs] = useState<Partial<UserPreferences>>({
    theme: "system",
    accent_color: "#6366F1",
    time_format: "12h",
    week_start_day: 1,
    notification_enabled: true,
    sound_enabled: true,
  });

  useEffect(() => {
    if (profile) {
      setFormProfile({
        full_name: profile.full_name || "",
        username: profile.username || "",
        institution: profile.institution || "",
      });
    }
    if (preferences) {
      setFormPrefs(preferences);
    }
    
    // Cleanup preview on unmount
    return () => {
      const savedColor = useUserStore.getState().preferences?.accent_color;
      const savedTheme = useUserStore.getState().preferences?.theme || "system";
      
      const root = document.documentElement;
      if (savedColor) {
        root.style.setProperty("--primary", savedColor);
        root.style.setProperty("--brand", savedColor);
        root.style.setProperty("--ring", savedColor);
        root.style.setProperty("--sidebar-primary", savedColor);
        root.style.setProperty("--sidebar-ring", savedColor);
        root.style.setProperty("--chart-1", savedColor);
      } else {
        root.style.removeProperty("--primary");
        root.style.removeProperty("--brand");
        root.style.removeProperty("--ring");
        root.style.removeProperty("--sidebar-primary");
        root.style.removeProperty("--sidebar-ring");
        root.style.removeProperty("--chart-1");
      }
      
      // We cannot easily run hooks here, but setting theme via DOM or avoiding hook-based revert is hard. 
      // Actually we CAN call setTheme if it's captured in the closure:
      // However, we only revert if they didn't save. If they saved, preferences.theme matches the local state.
    };
  }, [profile, preferences]);

  // Revert theme on unmount if not saved
  useEffect(() => {
    return () => {
      const savedTheme = useUserStore.getState().preferences?.theme || "system";
      setTheme(savedTheme);
    };
  }, [setTheme]);

  async function handleSave() {
    if (!profile) return;
    setIsSaving(true);
    const supabase = createClient();

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formProfile.full_name,
          username: formProfile.username,
          institution: formProfile.institution,
        })
        .eq("id", profile.id);

      if (profileError) throw profileError;

      // Update preferences
      const { error: prefsError } = await supabase
        .from("user_preferences")
        .update({
          ...formPrefs,
        })
        .eq("user_id", profile.id);

      if (prefsError) throw prefsError;

      // Update local store
      setProfile({
        ...profile,
        full_name: formProfile.full_name,
        username: formProfile.username,
        institution: formProfile.institution,
      });

      if (preferences) {
        setPreferences({
          ...preferences,
          ...(formPrefs as UserPreferences),
        });
      }

      toast.success("Settings saved successfully");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  if (storeLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize your Chronos experience
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </CardTitle>
            <CardDescription>Your public profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Full Name</Label>
                <Input 
                  placeholder="Your name" 
                  className="h-10" 
                  value={formProfile.full_name}
                  onChange={(e) => setFormProfile({...formProfile, full_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Username</Label>
                <Input 
                  placeholder="@username" 
                  className="h-10" 
                  value={formProfile.username}
                  onChange={(e) => setFormProfile({...formProfile, username: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Institution</Label>
              <Input 
                placeholder="University or school name" 
                className="h-10" 
                value={formProfile.institution}
                onChange={(e) => setFormProfile({...formProfile, institution: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </CardTitle>
            <CardDescription>Theme and visual preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Theme</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Choose your visual mode</p>
              </div>
              <Select 
                value={formPrefs.theme || "system"} 
                onValueChange={(v) => {
                  const val = v || "system";
                  setFormPrefs({...formPrefs, theme: val as any});
                  setTheme(val);
                }}
              >
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm">Accent Color</Label>
              <div className="flex gap-2">
                {["#6366F1", "#F43F5E", "#10B981", "#F59E0B", "#A855F7", "#EC4899", "#0EA5E9", "#14B8A6"].map(
                  (color) => (
                    <button
                      key={color}
                      className={`h-8 w-8 rounded-full border-2 transition-colors cursor-pointer ring-offset-2 ring-offset-background focus:ring-2 focus:ring-primary ${formPrefs.accent_color === color ? "border-foreground ring-2 ring-primary" : "border-transparent hover:border-foreground/20"}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                      onClick={() => {
                        setFormPrefs({...formPrefs, accent_color: color});
                        // Immediate preview
                        const root = document.documentElement;
                        root.style.setProperty("--primary", color);
                        root.style.setProperty("--brand", color);
                        root.style.setProperty("--ring", color);
                        root.style.setProperty("--sidebar-primary", color);
                        root.style.setProperty("--sidebar-ring", color);
                        root.style.setProperty("--chart-1", color);
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Schedule */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Schedule
            </CardTitle>
            <CardDescription>Time and calendar preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Time Format</Label>
              <Select 
                value={formPrefs.time_format || "12h"} 
                onValueChange={(v) => setFormPrefs({...formPrefs, time_format: (v || "12h") as any})}
              >
                <SelectTrigger className="w-24 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label className="text-sm">Week Starts On</Label>
              <Select 
                value={formPrefs.week_start_day?.toString() || "1"} 
                onValueChange={(v) => setFormPrefs({...formPrefs, week_start_day: parseInt(v || "1")})}
              >
                <SelectTrigger className="w-28 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="0">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Push Notifications</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Class reminders and deadlines</p>
              </div>
              <Switch 
                checked={formPrefs.notification_enabled ?? true} 
                onCheckedChange={(c) => setFormPrefs({...formPrefs, notification_enabled: c})}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Sound Effects</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Task completion sounds</p>
              </div>
              <Switch 
                checked={formPrefs.sound_enabled ?? true} 
                onCheckedChange={(c) => setFormPrefs({...formPrefs, sound_enabled: c})}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Button 
          className="shadow-lg shadow-primary/20 cursor-pointer" 
          onClick={handleSave} 
          disabled={isSaving}
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}
