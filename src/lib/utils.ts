import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: string, format: "12h" | "24h" = "12h"): string {
  const [hours, minutes] = time.split(":").map(Number);
  if (format === "24h") return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function getDayOfWeek(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Convert to Mon=0 ... Sun=6
}

export function generateShareCode(): string {
  return Math.random().toString(36).substring(2, 10);
}
