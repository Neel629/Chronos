"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, CheckCircle2, Circle, Trash2, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUserStore } from "@/stores/user-store";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  deadline: string;
  is_completed: boolean;
  type: string;
  created_at: string;
}

export default function GoalsPage() {
  const { profile } = useUserStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    target_value: 10,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: "tasks_completed"
  });

  useEffect(() => {
    fetchGoals();
  }, [profile]);

  async function fetchGoals() {
    if (!profile) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });
    if (data) setGoals(data);
  }

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: profile.id,
        ...form,
        current_value: 0,
        is_completed: false
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add goal");
    } else if (data) {
      setGoals([data, ...goals]);
      setIsAdding(false);
      toast.success("Goal added!");
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from("goals").delete().eq("id", id);
    setGoals(goals.filter(g => g.id !== id));
    toast.success("Goal deleted");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Set targets and track your progress.
          </p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> New Goal
        </Button>
      </motion.div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Goal Title</label>
                      <input 
                        required 
                        value={form.title} 
                        onChange={e => setForm({...form, title: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                        placeholder="e.g. Finish 10 tasks" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <select 
                        value={form.type} 
                        onChange={e => setForm({...form, type: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="tasks_completed">Tasks Completed</option>
                        <option value="focus_hours">Focus Hours</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Target Value</label>
                      <input 
                        required 
                        type="number" 
                        value={form.target_value} 
                        onChange={e => setForm({...form, target_value: Number(e.target.value)})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Deadline</label>
                      <input 
                        required 
                        type="date" 
                        value={form.deadline} 
                        onChange={e => setForm({...form, deadline: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea 
                      value={form.description} 
                      onChange={e => setForm({...form, description: e.target.value})}
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                      placeholder="Optional details..." 
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                    <Button type="submit" className="cursor-pointer">Save Goal</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 sm:grid-cols-2">
        {goals.map((goal, i) => {
          const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`group relative overflow-hidden transition-all duration-300 ${goal.is_completed ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      {goal.description && <p className="text-sm text-muted-foreground mt-0.5">{goal.description}</p>}
                    </div>
                    {goal.is_completed ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground/30 shrink-0" />
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-primary">
                        {goal.current_value} / {goal.target_value}
                      </span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress value={progress} className={goal.is_completed ? "[&>div]:bg-emerald-500" : ""} />
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(goal.id)}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-destructive/10 text-destructive rounded-full hover:bg-destructive hover:text-destructive-foreground transition-all cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {goals.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No goals set yet. Start aiming high!</p>
          </div>
        )}
      </div>
    </div>
  );
}
