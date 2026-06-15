"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, Medal, Target, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useUserStore } from "@/stores/user-store";
import { createClient } from "@/lib/supabase/client";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export default function AchievementsPage() {
  const { profile, streak, xp } = useUserStore();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [focusHours, setFocusHours] = useState(0);

  useEffect(() => {
    async function loadAchievements() {
      if (!profile) return;
      const supabase = createClient();

      // Get all achievements
      const { data: allAchievements } = await supabase.from("achievements").select("*");
      if (allAchievements) {
        setAchievements(allAchievements);
      }

      // Get user's unlocked achievements
      const { data: unlocked } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", profile.id);
      
      if (unlocked) {
        setUnlockedIds(new Set(unlocked.map(u => u.achievement_id)));
      }

      // Get stats for progress bars
      const { count } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "done")
        .eq("user_id", profile.id);
      setTasksCompleted(count || 0);

      const { data: focusData } = await supabase
        .from("focus_sessions")
        .select("duration_minutes")
        .eq("status", "completed")
        .eq("user_id", profile.id);
      
      if (focusData) {
        const totalMinutes = focusData.reduce((acc, curr) => acc + curr.duration_minutes, 0);
        setFocusHours(Math.floor(totalMinutes / 60));
      }
    }

    loadAchievements();
  }, [profile]);

  const getProgress = (type: string, value: number) => {
    if (unlockedIds.has(achievements.find(a => a.requirement_type === type && a.requirement_value === value)?.id || "")) {
      return 100;
    }
    let current = 0;
    if (type === "streak_days") current = streak?.longest_streak || 0;
    if (type === "tasks_completed") current = tasksCompleted;
    if (type === "focus_hours") current = focusHours;
    
    return Math.min(100, Math.round((current / value) * 100));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "epic": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      case "rare": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Achievements
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Unlock badges and earn XP by staying consistent.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {achievements.map((achievement, i) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const progress = getProgress(achievement.requirement_type, achievement.requirement_value);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`relative overflow-hidden transition-all duration-300 ${isUnlocked ? 'border-primary/30 shadow-md shadow-primary/5' : 'opacity-80 grayscale-[0.5]'}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-3xl ${isUnlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                      {isUnlocked ? achievement.icon : <Lock className="h-6 w-6 text-muted-foreground" />}
                    </div>
                    <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-base mb-1">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                    {achievement.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-primary">+{achievement.xp_reward} XP</span>
                      <span className="text-muted-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
