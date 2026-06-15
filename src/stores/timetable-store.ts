import { create } from "zustand";

export interface TimetableEvent {
  id: string;
  timetable_id: string;
  subject_id: string | null;
  title: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string | null;
  event_type: "class" | "lab" | "tutorial" | "custom";
  notes: string | null;
  // Populated from subject
  subject_name?: string;
  subject_color?: string;
}

export interface Subject {
  id: string;
  timetable_id: string;
  name: string;
  short_name: string | null;
  color: string;
  icon: string | null;
  instructor: string | null;
  room: string | null;
  credits: number | null;
}

interface Timetable {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

interface TimetableState {
  timetables: Timetable[];
  activeTimetable: Timetable | null;
  subjects: Subject[];
  events: TimetableEvent[];
  activeDay: number;
  setTimetables: (timetables: Timetable[]) => void;
  setActiveTimetable: (timetable: Timetable | null) => void;
  setSubjects: (subjects: Subject[]) => void;
  setEvents: (events: TimetableEvent[]) => void;
  setActiveDay: (day: number) => void;
  addEvent: (event: TimetableEvent) => void;
  updateEvent: (id: string, updates: Partial<TimetableEvent>) => void;
  removeEvent: (id: string) => void;
  addSubject: (subject: Subject) => void;
  removeSubject: (id: string) => void;
}

export const useTimetableStore = create<TimetableState>((set) => ({
  timetables: [],
  activeTimetable: null,
  subjects: [],
  events: [],
  activeDay: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
  setTimetables: (timetables) => set({ timetables }),
  setActiveTimetable: (activeTimetable) => set({ activeTimetable }),
  setSubjects: (subjects) => set({ subjects }),
  setEvents: (events) => set({ events }),
  setActiveDay: (activeDay) => set({ activeDay }),
  addEvent: (event) =>
    set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  removeEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
  addSubject: (subject) =>
    set((state) => ({ subjects: [...state.subjects, subject] })),
  removeSubject: (id) =>
    set((state) => ({
      subjects: state.subjects.filter((s) => s.id !== id),
    })),
}));
