import { createClient } from "./supabase/client";
import { useUserStore } from "@/stores/user-store";

export async function awardXP(amount: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const currentXP = useUserStore.getState().xp;
  if (!currentXP) return;

  // Optimistic UI update
  useUserStore.getState().addXP(amount);

  const newTotal = currentXP.total_xp + amount;
  let newLevel = currentXP.current_level;
  let nextLevelXP = currentXP.xp_to_next_level;

  while (newTotal >= nextLevelXP) {
    newLevel++;
    nextLevelXP = Math.floor(nextLevelXP * 1.5);
  }

  // Sync to Supabase
  await supabase
    .from("user_xp")
    .update({
      total_xp: newTotal,
      current_level: newLevel,
      xp_to_next_level: nextLevelXP,
    })
    .eq("user_id", user.id);
}

export async function checkAndIncrementStreak() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const currentStreak = useUserStore.getState().streak;
  if (!currentStreak) return;

  const todayStr = new Date().toISOString().split("T")[0];
  
  if (currentStreak.last_activity_date === todayStr) {
    // Already incremented today
    return;
  }

  // Optimistic UI update
  useUserStore.getState().incrementStreak();

  const newCurrent = currentStreak.current_streak + 1;
  const newLongest = Math.max(currentStreak.longest_streak, newCurrent);
  const newTotalActive = currentStreak.total_active_days + 1;

  // Sync to Supabase
  await supabase
    .from("streaks")
    .update({
      current_streak: newCurrent,
      longest_streak: newLongest,
      total_active_days: newTotalActive,
      last_activity_date: todayStr,
    })
    .eq("user_id", user.id);
}
