"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Plus,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const demoTasks = [
  { id: "1", title: "Complete Math Assignment — Chapter 7", subject: "Mathematics", color: "#6366F1", priority: "high" as const, due: "Today", status: "todo" as const },
  { id: "2", title: "Read Chapter 5 — Thermodynamics", subject: "Physics", color: "#F59E0B", priority: "medium" as const, due: "Tomorrow", status: "todo" as const },
  { id: "3", title: "Push final project to GitHub", subject: "CS 101", color: "#10B981", priority: "urgent" as const, due: "Today", status: "in_progress" as const },
  { id: "4", title: "Write essay outline — Shakespeare", subject: "English", color: "#F43F5E", priority: "medium" as const, due: "Fri", status: "todo" as const },
  { id: "5", title: "Review lecture notes — Algorithms", subject: "CS 101", color: "#10B981", priority: "low" as const, due: "Next week", status: "todo" as const },
  { id: "6", title: "Submit lab report", subject: "Physics", color: "#F59E0B", priority: "high" as const, due: "Wed", status: "done" as const },
  { id: "7", title: "Design wireframes for project", subject: "Design", color: "#A855F7", priority: "medium" as const, due: "Done", status: "done" as const },
];

const priorityConfig = {
  low: { color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Low" },
  medium: { color: "text-amber-500", bg: "bg-amber-500/10", label: "Medium" },
  high: { color: "text-rose-500", bg: "bg-rose-500/10", label: "High" },
  urgent: { color: "text-red-500", bg: "bg-red-500/10", label: "Urgent" },
};

export default function TasksPage() {
  const [filter, setFilter] = useState<"all" | "today" | "upcoming" | "completed">("all");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const filteredTasks = demoTasks.filter((task) => {
    const isCompleted = task.status === "done" || completedIds.has(task.id);
    switch (filter) {
      case "today":
        return task.due === "Today" && !isCompleted;
      case "upcoming":
        return task.due !== "Today" && !isCompleted;
      case "completed":
        return isCompleted;
      default:
        return !isCompleted;
    }
  });

  function toggleComplete(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {demoTasks.filter((t) => t.status !== "done" && !completedIds.has(t.id)).length} tasks remaining
          </p>
        </div>
        <Button size="sm" className="w-fit shadow-lg shadow-primary/20 cursor-pointer">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Task
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs cursor-pointer">All</TabsTrigger>
            <TabsTrigger value="today" className="text-xs cursor-pointer">Today</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs cursor-pointer">Upcoming</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs cursor-pointer">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Task List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, i) => {
            const isCompleted = task.status === "done" || completedIds.has(task.id);
            const priority = priorityConfig[task.priority];

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                layout
              >
                <Card
                  className={cn(
                    "transition-all duration-200 hover:shadow-md group cursor-pointer",
                    isCompleted && "opacity-60"
                  )}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleComplete(task.id)}
                      className="shrink-0 cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary/50 transition-colors" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "text-sm font-medium truncate transition-all",
                          isCompleted && "line-through text-muted-foreground"
                        )}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: task.color }}
                        />
                        <span className="text-[11px] text-muted-foreground truncate">
                          {task.subject}
                        </span>
                      </div>
                    </div>

                    {/* Priority & Due */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="secondary"
                        className={cn("text-[10px]", priority.bg, priority.color)}
                      >
                        {priority.label}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {task.due}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-4xl mb-3">
              {filter === "completed" ? "🏆" : "✨"}
            </div>
            <h3 className="text-lg font-semibold mb-1">
              {filter === "completed"
                ? "No completed tasks yet"
                : "All clear!"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filter === "completed"
                ? "Complete your first task to see it here."
                : "Nothing to do? That's suspicious 🤔"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
