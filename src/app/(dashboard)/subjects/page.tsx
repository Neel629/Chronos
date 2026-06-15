"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, MapPin, Hash, Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTimetableStore } from "@/stores/timetable-store";
import { useUIStore } from "@/stores/ui-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SubjectsPage() {
  const subjects = useTimetableStore((s) => s.subjects);
  const removeSubject = useTimetableStore((s) => s.removeSubject);
  const setQuickAddOpen = useUIStore((s) => s.setQuickAddOpen);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    
    // Optimistic UI update
    const previousSubjects = [...subjects];
    removeSubject(id);

    const supabase = createClient();
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete subject");
      // Revert on error
      useTimetableStore.getState().setSubjects(previousSubjects);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Subjects
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'} this semester
          </p>
        </div>
        <button 
          onClick={() => setQuickAddOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Subject</span>
        </button>
      </motion.div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl mt-8">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No subjects yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first subject to get started.</p>
          <button 
            onClick={() => setQuickAddOpen(true)}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Subject</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="group relative hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="h-1.5" style={{ backgroundColor: subject.color }} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-base">{subject.name}</h3>
                      <span className="text-xs text-muted-foreground font-medium">
                        {subject.short_name}
                      </span>
                    </div>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.short_name?.charAt(0) || subject.name.charAt(0)}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{subject.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{subject.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 shrink-0" />
                      <span>{subject.credits} credits</span>
                    </div>
                  </div>
                </CardContent>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(subject.id)}
                    className="p-2 bg-destructive/10 text-destructive rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: subjects.length * 0.06 }}
          >
            <Card 
              onClick={() => setQuickAddOpen(true)}
              className="h-full border-dashed hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer group flex items-center justify-center min-h-[180px]"
            >
              <CardContent className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <Plus className="h-8 w-8" />
                <span className="text-sm font-medium">Add Subject</span>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
