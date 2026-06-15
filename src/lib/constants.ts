// ─── Brand ───────────────────────────────────────────────
export const APP_NAME = "Chronos";
export const APP_DESCRIPTION = "The productivity companion Gen Z actually wants to use.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ─── Days ────────────────────────────────────────────────
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

// ─── Time Grid ───────────────────────────────────────────
export const TIME_START = 8; // 8 AM
export const TIME_END = 20; // 8 PM
export const TIME_SLOTS = Array.from({ length: TIME_END - TIME_START }, (_, i) => TIME_START + i);

// ─── Subject Colors ─────────────────────────────────────
export const SUBJECT_COLORS = [
  { name: "Indigo", value: "#6366F1" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Emerald", value: "#10B981" },
  { name: "Sky", value: "#0EA5E9" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Orange", value: "#F97316" },
  { name: "Cyan", value: "#06B6D4" },
] as const;

// ─── Event Types ─────────────────────────────────────────
export const EVENT_TYPES = [
  { value: "class", label: "Class", icon: "BookOpen" },
  { value: "lab", label: "Lab", icon: "FlaskConical" },
  { value: "tutorial", label: "Tutorial", icon: "GraduationCap" },
  { value: "custom", label: "Custom", icon: "Calendar" },
] as const;

// ─── Task Priorities ─────────────────────────────────────
export const TASK_PRIORITIES = [
  { value: "low", label: "Low", color: "#10B981" },
  { value: "medium", label: "Medium", color: "#F59E0B" },
  { value: "high", label: "High", color: "#F43F5E" },
  { value: "urgent", label: "Urgent", color: "#EF4444" },
] as const;

// ─── Gamification ────────────────────────────────────────
export const XP_REWARDS = {
  TASK_COMPLETED: 10,
  STREAK_MAINTAINED: 5,
  FOCUS_SESSION: 15,
  ACHIEVEMENT_EARNED: 25,
  GOAL_COMPLETED: 50,
} as const;

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000,
] as const;
