"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DAYS_SHORT, TIME_SLOTS } from "@/lib/constants";
import { formatTime } from "@/lib/utils";

// Demo events for visual preview
const demoEvents = [
  { id: "1", day: 0, start: 9, end: 10, title: "Mathematics", room: "A-201", color: "#6366F1" },
  { id: "2", day: 0, start: 11, end: 12, title: "Physics Lab", room: "Lab 3", color: "#F59E0B" },
  { id: "3", day: 0, start: 14, end: 15, title: "CS 101", room: "B-105", color: "#10B981" },
  { id: "4", day: 1, start: 9, end: 11, title: "English", room: "C-302", color: "#F43F5E" },
  { id: "5", day: 1, start: 13, end: 14, title: "Mathematics", room: "A-201", color: "#6366F1" },
  { id: "6", day: 2, start: 10, end: 12, title: "Physics Lab", room: "Lab 3", color: "#F59E0B" },
  { id: "7", day: 2, start: 14, end: 16, title: "Design", room: "D-101", color: "#A855F7" },
  { id: "8", day: 3, start: 9, end: 10, title: "CS 101", room: "B-105", color: "#10B981" },
  { id: "9", day: 3, start: 11, end: 12, title: "English", room: "C-302", color: "#F43F5E" },
  { id: "10", day: 3, start: 15, end: 17, title: "Mathematics", room: "A-201", color: "#6366F1" },
  { id: "11", day: 4, start: 9, end: 11, title: "Physics Lab", room: "Lab 3", color: "#F59E0B" },
  { id: "12", day: 4, start: 13, end: 14, title: "Design", room: "D-101", color: "#A855F7" },
];

export default function TimetablePage() {
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = useState(today);

  const eventsForView =
    viewMode === "day"
      ? demoEvents.filter((e) => e.day === selectedDay)
      : demoEvents;

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Timetable
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Semester 3 — Week View
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-border/50 p-0.5">
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer",
                viewMode === "week"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer",
                viewMode === "day"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Day
            </button>
          </div>
          <Button size="sm" className="shadow-lg shadow-primary/20 cursor-pointer">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Class
          </Button>
        </div>
      </motion.div>

      {/* Day Selector (Day View) */}
      {viewMode === "day" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 overflow-x-auto pb-2"
        >
          {DAYS_SHORT.slice(0, 6).map((day, i) => (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer shrink-0",
                selectedDay === i
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {day}
              {i === today && (
                <div className="mt-1 mx-auto h-1 w-1 rounded-full bg-current" />
              )}
            </button>
          ))}
        </motion.div>
      )}

      {/* Timetable Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div
              className={cn(
                "min-w-[600px]",
                viewMode === "week" ? "grid grid-cols-[60px_repeat(6,1fr)]" : "grid grid-cols-[60px_1fr]"
              )}
            >
              {/* Header Row */}
              <div className="sticky top-0 z-10 bg-card border-b border-border/50 p-2" />
              {(viewMode === "week" ? DAYS_SHORT.slice(0, 6) : [DAYS_SHORT[selectedDay]]).map(
                (day, i) => {
                  const dayIndex = viewMode === "week" ? i : selectedDay;
                  const isToday = dayIndex === today;
                  return (
                    <div
                      key={day}
                      className={cn(
                        "sticky top-0 z-10 bg-card border-b border-l border-border/50 p-2 text-center",
                        isToday && "bg-primary/5"
                      )}
                    >
                      <div
                        className={cn(
                          "text-xs font-semibold uppercase tracking-wider",
                          isToday ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {day}
                      </div>
                      {isToday && (
                        <div className="mt-1 mx-auto h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                }
              )}

              {/* Time Rows */}
              {TIME_SLOTS.map((hour) => (
                <div key={hour} className="contents">
                  {/* Time Label */}
                  <div className="border-t border-border/30 p-1.5 text-[10px] text-muted-foreground text-right pr-2 h-16 flex items-start justify-end pt-2">
                    {formatTime(`${hour}:00`)}
                  </div>

                  {/* Day Cells */}
                  {(viewMode === "week"
                    ? [0, 1, 2, 3, 4, 5]
                    : [selectedDay]
                  ).map((dayIdx) => {
                    const event = eventsForView.find(
                      (e) => e.day === dayIdx && e.start === hour
                    );
                    const isSpanned = eventsForView.some(
                      (e) => e.day === dayIdx && e.start < hour && e.end > hour
                    );
                    const isToday = dayIdx === today;

                    return (
                      <div
                        key={`${dayIdx}-${hour}`}
                        className={cn(
                          "relative border-t border-l border-border/30 h-16",
                          isToday && "bg-primary/[0.02]",
                          !event && !isSpanned && "hover:bg-accent/30 cursor-pointer transition-colors"
                        )}
                      >
                        {event && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-x-0.5 top-0.5 rounded-lg p-2 text-white cursor-pointer hover:brightness-110 transition-all z-10"
                            style={{
                              backgroundColor: event.color,
                              height: `${(event.end - event.start) * 64 - 4}px`,
                            }}
                          >
                            <div className="text-xs font-semibold truncate">
                              {event.title}
                            </div>
                            <div className="text-[10px] opacity-80 truncate">
                              {event.room}
                            </div>
                            <div className="text-[9px] opacity-70 mt-0.5">
                              {formatTime(`${event.start}:00`)} –{" "}
                              {formatTime(`${event.end}:00`)}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
