import { create } from "zustand";

export interface Task {
  id: string;
  subject_id: string | null;
  timetable_id: string | null;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;
  completed_at: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  tags: string[];
  order_index: number;
  // Populated
  subject_name?: string;
  subject_color?: string;
}

type TaskFilter = "all" | "today" | "upcoming" | "completed";
type TaskSort = "due_date" | "priority" | "created";

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  sort: TaskSort;
  subjectFilter: string | null;
  setTasks: (tasks: Task[]) => void;
  setFilter: (filter: TaskFilter) => void;
  setSort: (sort: TaskSort) => void;
  setSubjectFilter: (subjectId: string | null) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  completeTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  filter: "all",
  sort: "due_date",
  subjectFilter: null,
  setTasks: (tasks) => set({ tasks }),
  setFilter: (filter) => set({ filter }),
  setSort: (sort) => set({ sort }),
  setSubjectFilter: (subjectFilter) => set({ subjectFilter }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  completeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "done" as const,
              completed_at: new Date().toISOString(),
            }
          : t
      ),
    })),
}));
