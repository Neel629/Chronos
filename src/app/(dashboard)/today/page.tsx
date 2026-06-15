"use client";

import { motion } from "framer-motion";
import {
  Flame,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowRight,
  Zap,
  Target,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getGreeting } from "@/lib/utils";
import { DAYS_SHORT } from "@/lib/constants";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

// Demo data for visual purposes until Supabase is connected
const demoEvents = [
  { id: "1", time: "9:00 AM", title: "Mathematics", room: "A-201", color: "#6366F1", type: "class" },
  { id: "2", time: "11:00 AM", title: "Physics Lab", room: "Lab 3", color: "#F59E0B", type: "lab" },
  { id: "3", time: "2:00 PM", title: "CS 101", room: "B-105", color: "#10B981", type: "class" },
  { id: "4", time: "4:00 PM", title: "English", room: "C-302", color: "#F43F5E", type: "tutorial" },
];

const demoTasks = [
  { id: "1", title: "Complete Math Assignment", subject: "Mathematics", color: "#6366F1", priority: "high", due: "Today" },
  { id: "2", title: "Read Chapter 5 — Thermodynamics", subject: "Physics", color: "#F59E0B", priority: "medium", due: "Tomorrow" },
  { id: "3", title: "Push Project Repo", subject: "CS 101", color: "#10B981", priority: "low", due: "Wed" },
];

const today = new Date();
const dayName = DAYS_SHORT[today.getDay() === 0 ? 6 : today.getDay() - 1];

export default function TodayPage() {
  const greeting = getGreeting();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {greeting} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {today.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <Button size="sm" className="w-fit shadow-lg shadow-primary/20 cursor-pointer">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Task
          </Button>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {/* Streak */}
        <Card className="border-streak/20 bg-streak/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="text-3xl animate-flame">🔥</div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-[11px] text-muted-foreground">Day Streak</div>
            </div>
          </CardContent>
        </Card>

        {/* XP */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Level 1</span>
            </div>
            <Progress value={0} className="h-1.5" />
            <div className="text-[10px] text-muted-foreground mt-1">0 / 100 XP</div>
          </CardContent>
        </Card>

        {/* Tasks Done */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">0/3</div>
              <div className="text-[11px] text-muted-foreground">Tasks Today</div>
            </div>
          </CardContent>
        </Card>

        {/* Classes */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">4</div>
              <div className="text-[11px] text-muted-foreground">Classes Today</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* ── Schedule Timeline ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Today&apos;s Schedule
                </CardTitle>
                <Link href="/timetable">
                  <Button variant="ghost" size="sm" className="text-xs cursor-pointer">
                    View full
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {demoEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  {/* Time */}
                  <div className="w-16 text-xs text-muted-foreground font-medium shrink-0">
                    {event.time}
                  </div>

                  {/* Color Bar */}
                  <div
                    className="w-1 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: event.color }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.room}</div>
                  </div>

                  {/* Type Badge */}
                  <Badge variant="secondary" className="text-[10px] capitalize shrink-0">
                    {event.type}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Tasks ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Pending Tasks
                </CardTitle>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm" className="text-xs cursor-pointer">
                    All tasks
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {demoTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  {/* Checkbox */}
                  <button className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/10 transition-colors shrink-0 cursor-pointer">
                    <CheckCircle2 className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity text-primary" />
                  </button>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{task.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: task.color }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {task.subject}
                      </span>
                    </div>
                  </div>

                  {/* Due */}
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {task.due}
                  </span>
                </motion.div>
              ))}

              <Separator className="my-2 opacity-50" />
              <Button variant="ghost" className="w-full text-xs text-muted-foreground cursor-pointer">
                <Plus className="mr-1.5 h-3 w-3" />
                Add task
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
