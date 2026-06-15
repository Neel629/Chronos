"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, BookOpen, Calendar, X } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import { SubjectForm } from "./subject-form";
import { ClassForm } from "./class-form";
import { cn } from "@/lib/utils";

type EntityType = "task" | "subject" | "class" | null;

export function QuickAddModal() {
  const { quickAddOpen, setQuickAddOpen } = useUIStore();
  const [selectedType, setSelectedType] = useState<EntityType>(null);

  // Reset state when closing
  function handleOpenChange(open: boolean) {
    setQuickAddOpen(open);
    if (!open) {
      setTimeout(() => setSelectedType(null), 300);
    }
  }

  return (
    <Dialog open={quickAddOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border/50 bg-background/95 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {!selectedType ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold tracking-tight">What to add?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose an item to create
                </p>
              </div>

              <div className="grid gap-3">
                <button
                  onClick={() => setSelectedType("task")}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">New Task</div>
                    <div className="text-xs text-muted-foreground">Assignment, reading, or project</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType("class")}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">New Class</div>
                    <div className="text-xs text-muted-foreground">Lecture, lab, or tutorial session</div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType("subject")}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all group cursor-pointer"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">New Subject</div>
                    <div className="text-xs text-muted-foreground">Course or module registration</div>
                  </div>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="relative p-6"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setSelectedType(null)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="font-semibold">
                  Add {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                </div>
              </div>

              {/* Dynamic Form */}
              {selectedType === "task" && <TaskForm onSuccess={() => handleOpenChange(false)} />}
              {selectedType === "subject" && <SubjectForm onSuccess={() => handleOpenChange(false)} />}
              {selectedType === "class" && <ClassForm onSuccess={() => handleOpenChange(false)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
