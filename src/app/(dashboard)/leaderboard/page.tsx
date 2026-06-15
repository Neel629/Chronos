"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Flame, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/stores/user-store";
import { createClient } from "@/lib/supabase/client";

interface LeaderboardEntry {
  id: string; // profile id
  username: string;
  full_name: string;
  avatar_url: string;
  total_xp: number;
  current_level: number;
}

export default function LeaderboardPage() {
  const { profile } = useUserStore();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const supabase = createClient();
      
      // We join user_xp and profiles
      const { data, error } = await supabase
        .from('user_xp')
        .select(`
          total_xp,
          current_level,
          profiles (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .order('total_xp', { ascending: false })
        .limit(50);

      if (data && !error) {
        // Map the joined data
        const mapped = data.map((d: any) => ({
          id: d.profiles.id,
          username: d.profiles.username,
          full_name: d.profiles.full_name,
          avatar_url: d.profiles.avatar_url,
          total_xp: d.total_xp,
          current_level: d.current_level,
        }));
        setLeaders(mapped);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
        <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
        <h1 className="text-3xl font-bold tracking-tight">Global Leaderboard</h1>
        <p className="text-muted-foreground mt-2">See how you stack up against other focused students.</p>
      </motion.div>

      <Card className="border-border/50 shadow-xl shadow-primary/5">
        <CardContent className="p-0">
          <div className="grid grid-cols-[40px_1fr_80px] sm:grid-cols-[60px_1fr_100px_100px] text-xs font-semibold text-muted-foreground uppercase tracking-wider p-3 sm:p-4 border-b border-border/50 bg-muted/30">
            <div className="text-center">Rank</div>
            <div>Student</div>
            <div className="text-right hidden sm:block">Level</div>
            <div className="text-right">XP</div>
          </div>
          
          <div className="divide-y divide-border/30">
            {leaders.map((user, i) => {
              const isCurrentUser = profile?.id === user.id;
              
              let RankIcon = null;
              if (i === 0) RankIcon = <Medal className="h-6 w-6 text-yellow-500 drop-shadow-md mx-auto" />;
              else if (i === 1) RankIcon = <Medal className="h-6 w-6 text-slate-300 drop-shadow-md mx-auto" />;
              else if (i === 2) RankIcon = <Medal className="h-6 w-6 text-amber-600 drop-shadow-md mx-auto" />;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`grid grid-cols-[40px_1fr_80px] sm:grid-cols-[60px_1fr_100px_100px] items-center p-3 sm:p-4 transition-colors hover:bg-muted/50 ${isCurrentUser ? 'bg-primary/10 hover:bg-primary/15' : ''}`}
                >
                  <div className="text-center font-bold text-base sm:text-lg">
                    {RankIcon || <span className="text-muted-foreground">{i + 1}</span>}
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-background shadow-sm">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {(user.full_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <div className="font-semibold flex items-center gap-2">
                        {user.full_name || user.username || 'Anonymous'}
                        {isCurrentUser && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        @{user.username || 'student'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right font-medium text-sm flex items-center justify-end gap-1 text-primary hidden sm:flex">
                    <Star className="h-3.5 w-3.5 fill-primary/20" />
                    {user.current_level}
                  </div>
                  
                  <div className="text-right font-bold text-sm tabular-nums">
                    {user.total_xp.toLocaleString()}
                  </div>
                </motion.div>
              );
            })}
            
            {leaders.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No users found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
