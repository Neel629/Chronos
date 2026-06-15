"use client";

import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  Target,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn, getGreeting } from "@/lib/utils";
import { useTimetableStore } from "@/stores/timetable-store";
import { useTaskStore } from "@/stores/task-store";
import { useUserStore } from "@/stores/user-store";
import Link from "next/link";
import { isToday } from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function TodayPage() {
  const greeting = getGreeting();
  const events = useTimetableStore((s) => s.events);
  const tasks = useTaskStore((s) => s.tasks);
  const userStreak = useUserStore((s) => s.streak);
  const userXP = useUserStore((s) => s.xp);
  const userStoreProfile = useUserStore((s) => s.profile);

  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const todayEvents = events
    .filter((e) => e.day_of_week === todayIndex)
    .map((e) => ({
      id: e.id,
      title: e.title,
      type: e.event_type,
      time: `${e.start_time.slice(0, 5)} - ${e.end_time.slice(0, 5)}`,
      room: e.room,
      color: e.subject_color || "#6366F1",
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  const todayTasks = tasks.filter((t) => {
    if (!t.due_date) return false;
    return isToday(new Date(t.due_date));
  });

  const completedToday = todayTasks.filter((t) => t.status === "done").length;
  const pendingTasks = todayTasks.filter((t) => t.status !== "done");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {greeting}{userStoreProfile ? `, ${userStoreProfile.full_name?.split(" ")[0] || userStoreProfile.username}` : ""} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date().toLocaleDateString("en-US", {
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

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="grid grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <Card className="border-streak/20 bg-streak/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-500">
              <Flame className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Streak</h3>
            </div>
            <div className="text-3xl font-bold tracking-tight mt-2 flex items-baseline gap-1">
              {userStreak?.current_streak || 0}{" "}
              <span className="text-sm font-medium text-muted-foreground">days</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Keep it up! 🔥</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 via-background to-background border-amber-500/20 overflow-hidden relative">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-500">
              <Trophy className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Experience</h3>
            </div>
            <div className="text-3xl font-bold tracking-tight mt-2 flex items-baseline gap-1">
              Lvl {userXP?.current_level || 1}
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{userXP?.total_xp || 0} XP</span>
                <span>{userXP?.xp_to_next_level || 100} XP</span>
              </div>
              <Progress
                value={
                  ((userXP?.total_xp || 0) / (userXP?.xp_to_next_level || 100)) * 100
                }
                className="h-1.5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 via-background to-background border-emerald-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-emerald-500">
              <Target className="h-5 w-5" />
              <h3 className="font-semibold text-sm">Today's Tasks</h3>
            </div>
            <div className="text-3xl font-bold tracking-tight mt-2 flex items-baseline gap-1">
              {completedToday}/{todayTasks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayTasks.length === 0
                ? "No tasks for today"
                : completedToday === todayTasks.length
                ? "All done! Great job! 🎉"
                : "Tasks completed"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-5">
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
                <Link
                  href="/timetable"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View full
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {todayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <Calendar className="h-8 w-8 opacity-20 mb-3" />
                  <p className="text-sm">No classes today. Enjoy your free time!</p>
                </div>
              ) : (
                <div className="relative pl-6 border-l-2 border-border/50 space-y-6">
                  {todayEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="relative group"
                    >
                      <div
                        className="absolute -left-[33px] top-1.5 h-3 w-3 rounded-full border-2 border-background"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="text-xs font-semibold text-muted-foreground mb-1">
                        {event.time}
                      </div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {event.room} • {event.type}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

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
                <Link
                  href="/tasks"
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 opacity-20 mb-3" />
                  <p className="text-sm">All caught up! No pending tasks today.</p>
                </div>
              ) : (
                pendingTasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="group flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <button className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/10 transition-colors shrink-0 cursor-pointer">
                      <CheckCircle2 className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity text-primary" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{task.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: task.subject_color || "#6366F1" }}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {task.subject_name || "No subject"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}

              <Separator className="my-2 opacity-50" />
              <button 
                className="flex items-center justify-center w-full p-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Plus className="mr-1.5 h-3 w-3" />
                Add task
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
