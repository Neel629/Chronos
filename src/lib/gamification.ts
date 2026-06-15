import { createClient } from "./supabase/client";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

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
    
  await checkAchievements(user.id);
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
    
  await checkAchievements(user.id);
}

export async function checkAchievements(userId: string) {
  const supabase = createClient();
  
  // Get user stats
  const { count: tasksDone } = await supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "done").eq("user_id", userId);
  const { data: focusData } = await supabase.from("focus_sessions").select("duration_minutes").eq("status", "completed").eq("user_id", userId);
  const totalFocusHours = focusData ? Math.floor(focusData.reduce((acc, curr) => acc + curr.duration_minutes, 0) / 60) : 0;
  const currentStreak = useUserStore.getState().streak?.longest_streak || 0;

  // Get all achievements
  const { data: achievements } = await supabase.from("achievements").select("*");
  if (!achievements) return;

  // Get unlocked
  const { data: unlocked } = await supabase.from("user_achievements").select("achievement_id").eq("user_id", userId);
  const unlockedIds = new Set(unlocked?.map(u => u.achievement_id) || []);

  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) continue;

    let earned = false;
    if (achievement.requirement_type === "tasks_completed" && (tasksDone || 0) >= achievement.requirement_value) earned = true;
    if (achievement.requirement_type === "streak_days" && currentStreak >= achievement.requirement_value) earned = true;
    if (achievement.requirement_type === "focus_hours" && totalFocusHours >= achievement.requirement_value) earned = true;

    if (earned) {
      // Insert into user_achievements
      await supabase.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievement.id
      });
      // Manually add XP without recursion
      const currentXP = useUserStore.getState().xp;
      if (currentXP) {
         useUserStore.getState().addXP(achievement.xp_reward);
         const newTotal = currentXP.total_xp + achievement.xp_reward;
         await supabase.from("user_xp").update({ total_xp: newTotal }).eq("user_id", userId);
      }
      
      toast.success(`Achievement Unlocked: ${achievement.name} 🎉`);
      
      // DB Notification
      await supabase.from("notifications").insert({
        user_id: userId,
        title: `Achievement Unlocked: ${achievement.name}`,
        body: achievement.description,
        type: "achievement"
      });
    }
  }
}
