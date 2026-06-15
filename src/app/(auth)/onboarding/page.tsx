"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const ACCENT_COLORS = [
  { name: "Indigo", value: "#6366F1" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Emerald", value: "#10B981" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Purple", value: "#A855F7" },
  { name: "Sky", value: "#0EA5E9" },
];

type Theme = "light" | "dark" | "system";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<"student" | "professional" | null>(null);
  const [timetableName, setTimetableName] = useState("");
  const [theme, setTheme] = useState<Theme>("dark");
  const [accentColor, setAccentColor] = useState("#6366F1");
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;
  const progress = ((step + 1) / totalSteps) * 100;

  async function handleComplete() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Update profile
        await supabase
          .from("profiles")
          .update({
            role: role || "student",
            onboarding_completed: true,
          })
          .eq("id", user.id);

        // Create first timetable
        if (timetableName.trim()) {
          await supabase.from("timetables").insert({
            user_id: user.id,
            name: timetableName.trim(),
            is_active: true,
          });
        }

        // Save preferences
        await supabase
          .from("user_preferences")
          .update({
            theme,
            accent_color: accentColor,
          })
          .eq("user_id", user.id);
      }

      router.push("/today");
      router.refresh();
    } catch (err) {
      console.error("Onboarding error:", err);
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-streak/5 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <Clock className="h-4.5 w-4.5" />
        </div>
        <span className="text-xl font-bold tracking-tight">Chronos</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-sm mb-8">
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {/* Step 0: Role */}
          {step === 0 && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold">What describes you best?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  This helps us personalize your experience
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setRole("student")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
                    role === "student"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border/50 hover:border-primary/30 hover:bg-accent/50"
                  )}
                >
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <span className="text-sm font-semibold">Student</span>
                </button>
                <button
                  onClick={() => setRole("professional")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
                    role === "professional"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border/50 hover:border-primary/30 hover:bg-accent/50"
                  )}
                >
                  <Briefcase className="h-8 w-8 text-primary" />
                  <span className="text-sm font-semibold">Professional</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Timetable Name */}
          {step === 1 && (
            <motion.div
              key="timetable"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold">Name your timetable</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  You can change this anytime
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Timetable name</Label>
                <Input
                  placeholder={
                    role === "student" ? "Semester 3" : "Work Schedule"
                  }
                  value={timetableName}
                  onChange={(e) => setTimetableName(e.target.value)}
                  className="h-12 text-base"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                {(role === "student"
                  ? ["Semester 1", "Semester 2", "Summer"]
                  : ["Work", "Side Project", "Freelance"]
                ).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setTimetableName(suggestion)}
                    className="px-3 py-1.5 rounded-full border border-border/50 text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Theme */}
          {step === 2 && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-bold">Choose your vibe</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pick a theme and accent color
                </p>
              </div>

              {/* Theme Selection */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "light" as Theme, icon: Sun, label: "Light" },
                  { value: "dark" as Theme, icon: Moon, label: "Dark" },
                  { value: "system" as Theme, icon: Monitor, label: "System" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer",
                      theme === option.value
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/30"
                    )}
                  >
                    <option.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs font-medium">{option.label}</span>
                  </button>
                ))}
              </div>

              {/* Accent Color */}
              <div className="space-y-3">
                <Label className="text-sm">Accent Color</Label>
                <div className="flex gap-3 justify-center">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setAccentColor(color.value)}
                      className={cn(
                        "h-9 w-9 rounded-full transition-all cursor-pointer",
                        accentColor === color.value
                          ? "ring-2 ring-offset-2 ring-offset-background scale-110"
                          : "hover:scale-105"
                      )}
                      style={{
                        backgroundColor: color.value,
                        outlineColor: accentColor === color.value ? color.value : undefined,
                      }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              className="cursor-pointer"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !role}
              className="shadow-lg shadow-primary/25 cursor-pointer"
            >
              Continue
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="shadow-lg shadow-primary/25 cursor-pointer"
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              {loading ? "Setting up..." : "Let's go!"}
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground">
        You can always change these in Settings
      </p>
    </div>
  );
}
