"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTimetableStore } from "@/stores/timetable-store";
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
import { DAYS_SHORT } from "@/lib/constants";

export function ClassForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const subjects = useTimetableStore((s) => s.subjects);
  const activeTimetable = useTimetableStore((s) => s.activeTimetable);
  const addEvent = useTimetableStore((s) => s.addEvent);

  const [formData, setFormData] = useState({
    title: "",
    subject_id: "",
    day_of_week: "0", // Monday
    start_time: "09:00",
    end_time: "10:00",
    room: "",
    event_type: "class",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTimetable) {
      setError("No active timetable found.");
      return;
    }
    if (!formData.subject_id) {
      setError("Please select a subject.");
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

    const newEvent = {
      user_id: user.id,
      timetable_id: activeTimetable.id,
      subject_id: formData.subject_id,
      title: formData.title,
      day_of_week: parseInt(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
      room: formData.room || null,
      event_type: formData.event_type,
    };

    const { data, error: dbError } = await supabase
      .from("timetable_events")
      .insert(newEvent)
      .select()
      .single();

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    // Attach subject details for UI
    const subject = subjects.find(s => s.id === data.subject_id);
    if (data) {
      addEvent({
        ...data,
        subject_name: subject?.name,
        subject_color: subject?.color,
      });
    }
    
    setLoading(false);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Class Title *</Label>
        <Input 
          required 
          placeholder="e.g. Lecture or Lab Session" 
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold">Subject *</Label>
        <Select 
          required
          value={formData.subject_id} 
          onValueChange={(val) => setFormData({ ...formData, subject_id: val || "" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.length === 0 && (
              <SelectItem value="none" disabled>No subjects created yet</SelectItem>
            )}
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
          <Label className="text-xs font-semibold">Day</Label>
          <Select 
            value={formData.day_of_week} 
            onValueChange={(val) => setFormData({ ...formData, day_of_week: val || "0" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_SHORT.map((day, idx) => (
                <SelectItem key={idx} value={idx.toString()}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Type</Label>
          <Select 
            value={formData.event_type} 
            onValueChange={(val) => setFormData({ ...formData, event_type: val || "class" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class">Class</SelectItem>
              <SelectItem value="lab">Lab</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Start</Label>
          <Input 
            type="time"
            required
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">End</Label>
          <Input 
            type="time"
            required
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Room</Label>
          <Input 
            placeholder="e.g. A2"
            value={formData.room}
            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
          />
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button type="submit" className="w-full shadow-lg shadow-primary/20 cursor-pointer" disabled={loading || subjects.length === 0}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Create Class
      </Button>
    </form>
  );
}
