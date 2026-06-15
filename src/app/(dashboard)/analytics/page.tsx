"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTaskStore } from "@/stores/task-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { useUserStore } from "@/stores/user-store";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AnalyticsPage() {
  const tasks = useTaskStore((s) => s.tasks);
  const subjects = useTimetableStore((s) => s.subjects);
  const userStreak = useUserStore((s) => s.streak);
  const userXP = useUserStore((s) => s.xp);

  // Compute tasks done
  const completedTasks = tasks.filter(t => t.status === "done");
  const tasksDoneCount = completedTasks.length;

  // Compute breakdown by subject
  const subjectBreakdown = subjects.map(sub => {
    const subTasks = completedTasks.filter(t => t.subject_id === sub.id);
    // Simple estimation: assume each task took 1 hour if no actual_minutes
    const hours = subTasks.length * 1.5; 
    return {
      name: sub.name,
      color: sub.color || "#6366F1",
      hours: hours
    };
  }).filter(s => s.hours > 0).sort((a, b) => b.hours - a.hours);

  const totalStudyHours = subjectBreakdown.reduce((acc, curr) => acc + curr.hours, 0) || 0;

  // Add remaining percentage
  const breakdownWithPct = subjectBreakdown.map(s => ({
    ...s,
    pct: totalStudyHours > 0 ? Math.round((s.hours / totalStudyHours) * 100) : 0
  }));

  // Dummy chart data for week, simulating based on total hours
  const studyHours = [0.5, 1.2, 0.8, 1.5, 2.0, totalStudyHours > 0 ? 1 : 0, totalStudyHours];
  const maxHours = Math.max(...studyHours, 1);
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Weekly Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          June 9 — June 15, 2026
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {[
          { label: "Study Hours", value: `${totalStudyHours}h`, icon: Clock, trend: "" },
          { label: "Tasks Done", value: tasksDoneCount.toString(), icon: CheckCircle2, trend: "" },
          { label: "Streak", value: `${userStreak?.current_streak || 0} days`, icon: Flame, trend: "🔥" },
          { label: "Level", value: `Lvl ${userXP?.current_level || 1}`, icon: Target, trend: "✨" },
        ].map((stat, i) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-medium text-emerald-500 flex items-center gap-0.5">
                  {stat.trend}
                </span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Study Hours Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Study Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-48">
                {weekDays.map((day, i) => {
                  const height = (studyHours[i] / maxHours) * 100;
                  const isToday = i === new Date().getDay() - 1;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.2 + i * 0.06, duration: 0.5, ease: "easeOut" }}
                        className="w-full max-w-[40px] rounded-t-lg relative group cursor-pointer"
                        style={{
                          backgroundColor: isToday
                            ? "oklch(0.55 0.24 265)"
                            : "oklch(0.55 0.24 265 / 20%)",
                        }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-[10px] font-medium px-2 py-1 rounded-md shadow-lg whitespace-nowrap border border-border/50">
                          {studyHours[i]}h
                        </div>
                      </motion.div>
                      <span className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">
                By Subject
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {breakdownWithPct.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-6">
                  Complete tasks assigned to subjects to see your breakdown.
                </div>
              ) : (
                breakdownWithPct.map((subject, i) => (
                  <motion.div
                    key={subject.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="font-medium text-xs">{subject.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {subject.hours}h ({subject.pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.pct}%` }}
                        transition={{ delay: 0.4 + i * 0.06, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
