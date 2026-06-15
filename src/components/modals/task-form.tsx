"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTimetableStore } from "@/stores/timetable-store";
import { useTaskStore } from "@/stores/task-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function TaskForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const subjects = useTimetableStore((s) => s.subjects);
  const activeTimetable = useTimetableStore((s) => s.activeTimetable);
  const addTask = useTaskStore((s) => s.addTask);

  const [formData, setFormData] = useState({
    title: "",
    subject_id: "none",
    due_date: "",
    priority: "medium",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const newTask = {
      user_id: user.id,
      title: formData.title,
      subject_id: formData.subject_id === "none" ? null : formData.subject_id,
      timetable_id: activeTimetable?.id || null,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      priority: formData.priority,
      status: "todo",
    };

    const { data, error: dbError } = await supabase
      .from("tasks")
      .insert(newTask)
      .select(`
        *,
        subjects (
          name,
          color
        )
      `)
      .single();

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    if (data) {
      addTask({
        ...data,
        subject_name: data.subjects?.name,
        subject_color: data.subjects?.color,
      });
    }
    
    setLoading(false);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Task Title *</Label>
        <Input 
          required 
          placeholder="e.g. Read Chapter 5" 
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Subject</Label>
        <Select 
          value={formData.subject_id} 
          onValueChange={(val) => setFormData({ ...formData, subject_id: val || "none" })}
        >
          <SelectTrigger>
            {formData.subject_id && formData.subject_id !== "none" ? (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: subjects.find(s => s.id === formData.subject_id)?.color }} />
                {subjects.find(s => s.id === formData.subject_id)?.name}
              </div>
            ) : (
              <span className={formData.subject_id === "none" ? "" : "text-muted-foreground"}>
                {formData.subject_id === "none" ? "No subject" : "Select a subject"}
              </span>
            )}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No subject</SelectItem>
            {subjects.map((sub) => (
              <SelectItem key={sub.id} value={sub.id}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: sub.color }} />
                  {sub.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Due Date</Label>
          <Input 
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Priority</Label>
          <Select 
            value={formData.priority} 
            onValueChange={(val) => setFormData({ ...formData, priority: val || "medium" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button type="submit" className="w-full shadow-lg shadow-primary/20 cursor-pointer" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Create Task
      </Button>
    </form>
  );
}
