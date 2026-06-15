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
  CalendarIcon,
  Check,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/stores/task-store";
import { useUIStore } from "@/stores/ui-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function TasksPage() {
  const { tasks, filter, setFilter, updateTask, removeTask } = useTaskStore();
  const setQuickAddOpen = useUIStore((s) => s.setQuickAddOpen);
  const [localCompletedIds, setLocalCompletedIds] = useState<Set<string>>(new Set());

  // Filter logic
  const filteredTasks = tasks.filter((task) => {
    const isCompleted = task.status === "done" || localCompletedIds.has(task.id);
    if (filter === "completed") return isCompleted;
    if (isCompleted) return false;
    
    // Simplistic filter mapping (could be enhanced based on dates)
    if (filter === "today") {
      if (!task.due_date) return false;
      const due = new Date(task.due_date).toDateString();
      const today = new Date().toDateString();
      return due === today;
    }
    if (filter === "upcoming") {
      if (!task.due_date) return false;
      const due = new Date(task.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return due > today;
    }
    return true;
  });

  async function handleToggleComplete(taskId: string) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newStatus = task.status === "done" ? "todo" : "done";
    
    // Optimistic
    updateTask(taskId, { status: newStatus });
    if (newStatus === "done") {
      setLocalCompletedIds(prev => new Set(prev).add(taskId));
    } else {
      setLocalCompletedIds(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      toast.error("Failed to update task");
      // Revert optimistic
      updateTask(taskId, { status: task.status });
    }
  }

  async function handleDelete(taskId: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    // Optimistic
    const previousTasks = [...tasks];
    removeTask(taskId);

    const supabase = createClient();
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      toast.error("Failed to delete task");
      // Revert optimistic
      useTaskStore.getState().setTasks(previousTasks);
    }
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
            {tasks.filter((t) => t.status !== "done" && !localCompletedIds.has(t.id)).length} tasks remaining
          </p>
        </div>
        <button 
          onClick={() => setQuickAddOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="text-xs cursor-pointer">All</TabsTrigger>
            <TabsTrigger value="today" className="text-xs cursor-pointer">Today</TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs cursor-pointer">Upcoming</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs cursor-pointer">Completed</TabsTrigger>
          </TabsList>

          <div className="space-y-2 mt-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, i) => {
                const isDone = task.status === "done" || localCompletedIds.has(task.id);
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
                        "transition-all duration-200 hover:shadow-md group",
                      )}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
                          className={cn(
                            "mt-1 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0",
                            isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/30 hover:border-primary"
                          )}
                        >
                          {isDone && <Check className="h-4 w-4" />}
                        </button>
                        
                        <div className={cn("flex-1 transition-all duration-300", isDone && "opacity-60")}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className={cn("font-medium", isDone && "line-through decoration-muted-foreground/50")}>
                                {task.title}
                              </h3>
                              {task.subject_id && (
                                <div className="flex items-center gap-1.5 mt-1 text-xs font-medium" style={{ color: task.subject_color }}>
                                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: task.subject_color }} />
                                  {task.subject_name}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                            {task.due_date && (
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {new Date(task.due_date).toLocaleDateString()}
                              </div>
                            )}
                            <div className={cn(
                              "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase",
                              task.priority === "urgent" ? "bg-red-500/10 text-red-500" :
                              task.priority === "high" ? "bg-orange-500/10 text-orange-500" :
                              task.priority === "medium" ? "bg-yellow-500/10 text-yellow-500" :
                              "bg-blue-500/10 text-blue-500"
                            )}>
                              {task.priority}
                            </div>
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
        </Tabs>
      </motion.div>
    </div>
  );
}
