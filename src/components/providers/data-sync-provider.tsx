"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { useTimetableStore } from "@/stores/timetable-store";
import { useTaskStore } from "@/stores/task-store";

export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const isFetched = useRef(false);
  const { setProfile, setStreak, setXP, setLoading } = useUserStore();
  const { setTimetables, setActiveTimetable, setSubjects, setEvents } =
    useTimetableStore();
  const { setTasks } = useTaskStore();

  useEffect(() => {
    if (isFetched.current) return;
    isFetched.current = true;

    async function fetchData() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Fetch User Data
      const [
        { data: profile },
        { data: streak },
        { data: xp },
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("streaks").select("*").eq("user_id", user.id).single(),
        supabase.from("user_xp").select("*").eq("user_id", user.id).single(),
      ]);

      if (profile) setProfile(profile);
      if (streak) setStreak(streak);
      if (xp) setXP(xp);

      // 2. Fetch Timetables & Active Timetable
      const { data: timetables } = await supabase
        .from("timetables")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (timetables) {
        setTimetables(timetables);
        const active = timetables.find((t) => t.is_active) || timetables[0];
        if (active) setActiveTimetable(active);

        if (active) {
          // 3. Fetch Subjects and Events for Active Timetable
          const [
            { data: subjects },
            { data: events },
          ] = await Promise.all([
            supabase
              .from("subjects")
              .select("*")
              .eq("timetable_id", active.id),
            supabase
              .from("timetable_events")
              .select("*")
              .eq("timetable_id", active.id),
          ]);

          if (subjects) setSubjects(subjects);
          if (events) {
            // Map subject data into events for easier UI rendering
            const enrichedEvents = events.map((event) => {
              const sub = subjects?.find((s) => s.id === event.subject_id);
              return {
                ...event,
                subject_name: sub?.name,
                subject_color: sub?.color,
              };
            });
            setEvents(enrichedEvents);
          }
        }
      }

      // 4. Fetch Tasks
      const { data: tasks } = await supabase
        .from("tasks")
        .select(`
          *,
          subjects (
            name,
            color
          )
        `)
        .eq("user_id", user.id)
        .order("due_date", { ascending: true });

      if (tasks) {
        const enrichedTasks = tasks.map((task) => ({
          ...task,
          subject_name: task.subjects?.name,
          subject_color: task.subjects?.color,
        }));
        setTasks(enrichedTasks);
      }

      setLoading(false);
    }

    fetchData();
  }, [
    setProfile,
    setStreak,
    setXP,
    setTimetables,
    setActiveTimetable,
    setSubjects,
    setEvents,
    setTasks,
    setLoading,
  ]);

  return <>{children}</>;
}
