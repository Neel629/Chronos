"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, RotateCcw, Target, Brain, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user-store";
import { createClient } from "@/lib/supabase/client";
import { awardXP, checkAndIncrementStreak } from "@/lib/gamification";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

type TimerMode = "focus" | "break";

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

export default function FocusPage() {
  const { profile } = useUserStore();
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(FOCUS_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive && mode === "focus" && !sessionStartedAt) {
      setSessionStartedAt(new Date().toISOString());
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60);
    setSessionStartedAt(null);
  };

  const skipTimer = () => {
    handleComplete(true);
  };

  const handleComplete = async (skipped = false) => {
    setIsActive(false);
    
    if (mode === "focus") {
      // Complete Focus Session
      if (!skipped && sessionStartedAt && profile) {
        toast.success("Focus session completed! +15 XP 🎉");
        
        // Gamification
        await awardXP(15);
        await checkAndIncrementStreak();

        // Save to DB
        const supabase = createClient();
        await supabase.from("focus_sessions").insert({
          user_id: profile.id,
          duration_minutes: FOCUS_MINUTES,
          started_at: sessionStartedAt,
          ended_at: new Date().toISOString(),
          status: "completed",
        });
      } else if (skipped && sessionStartedAt && profile) {
        // Abandoned
        const supabase = createClient();
        await supabase.from("focus_sessions").insert({
          user_id: profile.id,
          duration_minutes: Math.round((FOCUS_MINUTES * 60 - timeLeft) / 60),
          started_at: sessionStartedAt,
          ended_at: new Date().toISOString(),
          status: "abandoned",
        });
        toast("Focus session skipped.");
      }

      setMode("break");
      setTimeLeft(BREAK_MINUTES * 60);
      setSessionStartedAt(null);
    } else {
      // Break over
      toast("Break is over! Time to focus.");
      setMode("focus");
      setTimeLeft(FOCUS_MINUTES * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalTime = mode === "focus" ? FOCUS_MINUTES * 60 : BREAK_MINUTES * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="max-w-md mx-auto mt-12 space-y-8 flex flex-col items-center">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
          {mode === "focus" ? (
            <>
              <Brain className="h-8 w-8 text-primary" />
              Focus Time
            </>
          ) : (
            <>
              <Coffee className="h-8 w-8 text-emerald-500" />
              Take a Break
            </>
          )}
        </h1>
        <p className="text-muted-foreground mt-2">
          {mode === "focus" ? "Stay focused and earn XP." : "Relax and recharge your mind."}
        </p>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: "spring", bounce: 0.4 }}
        className="relative flex flex-col items-center justify-center w-72 h-72 rounded-full border-8 border-accent/50 bg-background shadow-2xl shadow-primary/10"
      >
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="136"
            cy="136"
            r="130"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className={mode === "focus" ? "text-primary" : "text-emerald-500"}
            strokeDasharray={130 * 2 * Math.PI}
            strokeDashoffset={130 * 2 * Math.PI - (progress / 100) * 130 * 2 * Math.PI}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>

        <AnimatePresence mode="wait">
          <motion.div
            key={timeLeft}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-6xl font-black tabular-nums tracking-tighter"
          >
            {formatTime(timeLeft)}
          </motion.div>
        </AnimatePresence>
        <div className="text-sm font-medium text-muted-foreground mt-2 uppercase tracking-widest">
          {mode === "focus" ? "Remaining" : "Break"}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-full cursor-pointer"
          onClick={resetTimer}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button 
          size="icon" 
          className="h-16 w-16 rounded-full shadow-lg shadow-primary/30 cursor-pointer"
          onClick={toggleTimer}
        >
          {isActive ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 translate-x-0.5" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 rounded-full cursor-pointer"
          onClick={skipTimer}
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
}
