"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTimetableStore } from "@/stores/timetable-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function SubjectForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const activeTimetable = useTimetableStore((s) => s.activeTimetable);
  const addSubject = useTimetableStore((s) => s.addSubject);

  const [formData, setFormData] = useState({
    name: "",
    short_name: "",
    color: "#6366F1",
    instructor: "",
    room: "",
    credits: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTimetable) {
      setError("No active timetable found.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const newSubject = {
      user_id: user.id,
      timetable_id: activeTimetable.id,
      name: formData.name,
      short_name: formData.short_name || null,
      color: formData.color,
      instructor: formData.instructor || null,
      room: formData.room || null,
      credits: formData.credits ? parseInt(formData.credits) : null,
    };

    const { data, error: dbError } = await supabase
      .from("subjects")
      .insert(newSubject)
      .select()
      .single();

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    // Update global state
    if (data) {
      addSubject(data);
    }
    
    setLoading(false);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Subject Name *</Label>
        <Input 
          required 
          placeholder="e.g. Data Structures" 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Abbreviation</Label>
          <Input 
            placeholder="e.g. CS201" 
            value={formData.short_name}
            onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Color</Label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              className="h-9 w-12 p-1 cursor-pointer" 
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
            <Input 
              value={formData.color} 
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="flex-1 font-mono uppercase text-xs" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Instructor</Label>
          <Input 
            placeholder="e.g. Dr. Smith" 
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Room</Label>
          <Input 
            placeholder="e.g. 4B" 
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Credits</Label>
        <Input 
          type="number" 
          placeholder="e.g. 3" 
          value={formData.credits}
          onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button type="submit" className="w-full shadow-lg shadow-primary/20 cursor-pointer" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Create Subject
      </Button>
    </form>
  );
}
