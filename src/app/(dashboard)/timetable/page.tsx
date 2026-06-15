"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DAYS_SHORT, TIME_SLOTS } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import { useTimetableStore } from "@/stores/timetable-store";
import { useUIStore } from "@/stores/ui-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function TimetablePage() {
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = useState(today);

  const events = useTimetableStore(s => s.events);
  const removeEvent = useTimetableStore(s => s.removeEvent);
  const setQuickAddOpen = useUIStore(s => s.setQuickAddOpen);

  // Map events to the format expected by the UI (hours as numbers)
  const mappedEvents = events.map(e => ({
    ...e,
    startHour: parseInt(e.start_time.split(":")[0]),
    endHour: parseInt(e.end_time.split(":")[0])
  }));

  const eventsForView =
    viewMode === "day"
      ? mappedEvents.filter((e) => e.day_of_week === selectedDay)
      : mappedEvents;

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Delete this class?")) return;
    
    const previousEvents = [...events];
    removeEvent(id);

    const supabase = createClient();
    const { error } = await supabase.from("timetable_events").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete class");
      useTimetableStore.getState().setEvents(previousEvents);
    }
  }

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
          <button 
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Class</span>
          </button>
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
                      (e) => e.day_of_week === dayIdx && e.startHour === hour
                    );
                    const isSpanned = eventsForView.some(
                      (e) => e.day_of_week === dayIdx && e.startHour < hour && e.endHour > hour
                    );
                    const isToday = dayIdx === today;

                    return (
                      <div
                        key={`${dayIdx}-${hour}`}
                        className={cn(
                          "relative border-t border-l border-border/30 h-16",
                          isToday && "bg-primary/[0.02]",
                          !event && !isSpanned && "hover:bg-accent/30 transition-colors"
                        )}
                      >
                        {event && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-x-0.5 top-0.5 rounded-lg p-2 text-white group overflow-hidden z-10"
                            style={{
                              backgroundColor: event.subject_color || "#6366F1",
                              height: `${(event.endHour - event.startHour) * 64 - 4}px`,
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="text-xs font-semibold truncate pr-2">
                                {event.title}
                              </div>
                              <button 
                                onClick={(e) => handleDelete(event.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/20 rounded transition-all cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-[10px] opacity-80 truncate">
                              {event.room}
                            </div>
                            <div className="text-[9px] opacity-70 mt-0.5">
                              {event.start_time.slice(0, 5)} – {event.end_time.slice(0, 5)}
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
