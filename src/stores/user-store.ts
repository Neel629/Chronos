import { create } from "zustand";

interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "student" | "professional";
  institution: string | null;
  onboarding_completed: boolean;
  timezone: string;
}

interface Streak {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_freezes: number;
  total_active_days: number;
}

interface XP {
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
}

interface UserState {
  profile: UserProfile | null;
  streak: Streak | null;
  xp: XP | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setStreak: (streak: Streak | null) => void;
  setXP: (xp: XP | null) => void;
  setLoading: (loading: boolean) => void;
  incrementStreak: () => void;
  addXP: (amount: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  streak: null,
  xp: null,
  isLoading: true,
  setProfile: (profile) => set({ profile }),
  setStreak: (streak) => set({ streak }),
  setXP: (xp) => set({ xp }),
  setLoading: (isLoading) => set({ isLoading }),
  incrementStreak: () =>
    set((state) => ({
      streak: state.streak
        ? {
            ...state.streak,
            current_streak: state.streak.current_streak + 1,
            longest_streak: Math.max(
              state.streak.longest_streak,
              state.streak.current_streak + 1
            ),
            total_active_days: state.streak.total_active_days + 1,
            last_activity_date: new Date().toISOString().split("T")[0],
          }
        : null,
    })),
  addXP: (amount) =>
    set((state) => {
      if (!state.xp) return {};
      const newTotal = state.xp.total_xp + amount;
      let newLevel = state.xp.current_level;
      let nextLevelXP = state.xp.xp_to_next_level;

      // Simple level-up logic
      while (newTotal >= nextLevelXP) {
        newLevel++;
        nextLevelXP = Math.floor(nextLevelXP * 1.5);
      }

      return {
        xp: {
          total_xp: newTotal,
          current_level: newLevel,
          xp_to_next_level: nextLevelXP,
        },
      };
    }),
}));
