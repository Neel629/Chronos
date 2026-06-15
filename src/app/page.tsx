"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Flame,
  Target,
  Zap,
  Calendar,
  CheckCircle2,
  BarChart3,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Timer,
  Users,
  Trophy,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

// ─── Animation Variants ──────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ─── Feature Data ────────────────────────────────────────
const features = [
  {
    icon: Calendar,
    title: "Smart Timetable",
    description:
      "Visual weekly grid with drag-and-drop. Rotating schedules, color-coded subjects, one-tap setup.",
  },
  {
    icon: CheckCircle2,
    title: "Task Flow",
    description:
      "Manage assignments with deadlines, priorities, and subject tags. Filter, sort, complete — earn XP.",
  },
  {
    icon: Flame,
    title: "Streak System",
    description:
      "Daily streaks that make consistency addictive. Streak freezes when life gets real.",
  },
  {
    icon: Timer,
    title: "Focus Timer",
    description:
      "Built-in Pomodoro with session tracking. See exactly where your time goes.",
  },
  {
    icon: BarChart3,
    title: "Weekly Insights",
    description:
      "Beautiful analytics showing study hours, task completion rates, and productivity patterns.",
  },
  {
    icon: Palette,
    title: "Your Aesthetic",
    description:
      "Dark mode, light mode, custom accents. A UI so clean you'll want to screenshot it.",
  },
];

const stats = [
  { value: "< 2s", label: "Load Time" },
  { value: "0", label: "Learning Curve" },
  { value: "∞", label: "Customization" },
  { value: "🔥", label: "Vibe Check" },
];

// ─── Floating Timetable Preview ──────────────────────────
function TimetablePreview() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = [
    { day: 0, start: 0, span: 2, color: "#6366F1", label: "Math", room: "A-201" },
    { day: 0, start: 3, span: 1, color: "#F59E0B", label: "Physics", room: "Lab 3" },
    { day: 1, start: 1, span: 2, color: "#10B981", label: "CS 101", room: "B-105" },
    { day: 1, start: 4, span: 1, color: "#6366F1", label: "Math", room: "A-201" },
    { day: 2, start: 0, span: 1, color: "#F43F5E", label: "English", room: "C-302" },
    { day: 2, start: 2, span: 2, color: "#F59E0B", label: "Physics", room: "Lab 3" },
    { day: 3, start: 1, span: 1, color: "#10B981", label: "CS 101", room: "B-105" },
    { day: 3, start: 3, span: 2, color: "#A855F7", label: "Design", room: "D-101" },
    { day: 4, start: 0, span: 2, color: "#6366F1", label: "Math", room: "A-201" },
    { day: 4, start: 3, span: 1, color: "#F43F5E", label: "English", room: "C-302" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="relative mx-auto max-w-2xl"
    >
      {/* Glow effect */}
      <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />

      <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Semester 3 — Week View</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-streak/10">
              <Flame className="w-3 h-3 text-streak" />
              <span className="text-xs font-bold text-streak">12</span>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="p-4">
          <div className="grid grid-cols-5 gap-1.5">
            {/* Day Headers */}
            {days.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pb-2"
              >
                {day}
              </div>
            ))}

            {/* Grid Cells */}
            {days.map((_, dayIdx) => (
              <div key={dayIdx} className="flex flex-col gap-1">
                {Array.from({ length: 5 }).map((_, slotIdx) => {
                  const slot = slots.find(
                    (s) => s.day === dayIdx && s.start === slotIdx
                  );
                  if (slot) {
                    return (
                      <motion.div
                        key={slotIdx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 0.8 + (dayIdx * 5 + slotIdx) * 0.04,
                          duration: 0.3,
                        }}
                        className="rounded-lg px-2 py-1.5 text-white text-[10px] font-medium"
                        style={{
                          backgroundColor: slot.color,
                          minHeight: `${slot.span * 28 + (slot.span - 1) * 4}px`,
                        }}
                      >
                        <div className="font-semibold">{slot.label}</div>
                        <div className="opacity-75 text-[8px]">{slot.room}</div>
                      </motion.div>
                    );
                  }
                  // Check if this slot is spanned by a previous slot
                  const spanning = slots.find(
                    (s) =>
                      s.day === dayIdx &&
                      s.start < slotIdx &&
                      s.start + s.span > slotIdx
                  );
                  if (spanning) return null;
                  return (
                    <div
                      key={slotIdx}
                      className="rounded-lg border border-dashed border-border/30 min-h-[28px]"
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Landing Page ───────────────────────────────────
export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-streak/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* ══════════════════════════════════════════════════
          NAVBAR
          ══════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 border-b border-border/50 glass"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex h-9 w-9 items-center justify-center shrink-0">
                <img src="/logo.png" alt="Chronos Logo" className="h-full w-full object-cover rounded-xl shadow-sm transition-transform group-hover:scale-105" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Chronos
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-sm cursor-pointer">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="text-sm shadow-lg shadow-primary/25 cursor-pointer">
                  Get Started
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4">
        <div className="mx-auto max-w-6xl text-center">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Built for the way you actually work
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mx-auto max-w-3xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Your schedule.{" "}
            <span className="text-gradient">Your streaks.</span>{" "}
            <br className="hidden sm:block" />
            Your move.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            The timetable app that gets it. Beautiful design, streak-powered
            motivation, and zero bloat. Made for students who refuse to settle
            for boring tools.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="h-12 px-8 text-base shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 cursor-pointer"
              >
                Start for free
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base cursor-pointer"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              See features
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-16 flex items-center justify-center gap-8 sm:gap-16"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Timetable Preview */}
          <div className="mt-16 sm:mt-20">
            <TimetablePreview />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES SECTION
          ══════════════════════════════════════════════════ */}
      <section id="features" className="py-24 sm:py-32 px-4">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Target className="h-3.5 w-3.5" />
              Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need.{" "}
              <span className="text-muted-foreground">Nothing you don&apos;t.</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
              No feature bloat. No steep learning curves. Just the tools that
              actually help you stay on track.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 border-t border-border/50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Zap className="h-3.5 w-3.5" />
              How it works
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Set up in 60 seconds.{" "}
              <span className="text-muted-foreground">Stay for the streaks.</span>
            </h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: Calendar,
                title: "Drop your schedule",
                desc: "Add your classes, labs, and events. We make it beautiful.",
              },
              {
                step: "02",
                icon: CheckCircle2,
                title: "Crush your tasks",
                desc: "Track assignments, hit deadlines, earn XP. Feel the progress.",
              },
              {
                step: "03",
                icon: Flame,
                title: "Build your streak",
                desc: "Show up daily. Watch your streak grow. Flex on your friends.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div className="mb-2 text-xs font-bold text-primary uppercase tracking-widest">
                  Step {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SOCIAL PROOF / ENGAGEMENT
          ══════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 border-t border-border/50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-8 lg:grid-cols-2 items-center"
          >
            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-streak/20 bg-streak/5 px-4 py-1.5 text-sm font-medium text-streak mb-6">
                <Trophy className="h-3.5 w-3.5" />
                Gamification
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                Productivity that{" "}
                <span className="text-gradient">feels like a game.</span>
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: Flame, text: "Daily streaks keep you coming back" },
                  { icon: Zap, text: "Earn XP for every task you complete" },
                  { icon: Trophy, text: "Unlock achievements and level up" },
                  { icon: Users, text: "Compete with friends on leaderboards" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-streak/5 blur-2xl" />
              <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-6 shadow-2xl space-y-4">
                {/* Streak Card */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl animate-flame">🔥</div>
                    <div>
                      <div className="text-2xl font-bold">12 days</div>
                      <div className="text-xs text-muted-foreground">Current streak</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-muted-foreground">Best: 34</div>
                  </div>
                </div>

                {/* XP Bar */}
                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Level 7</span>
                    <span className="text-xs text-muted-foreground">1,240 / 1,750 XP</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "70%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
                    />
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="flex gap-3">
                  {["🏆", "⚡", "🎯", "📚"].map((emoji, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex-1 flex items-center justify-center h-14 rounded-xl bg-background/50 border border-border/50 text-2xl hover:scale-110 transition-transform cursor-default"
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA SECTION
          ══════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 px-4 border-t border-border/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to own your time?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of students who switched from chaos to Chronos.
            Free forever. No credit card needed.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="h-12 px-10 text-base shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 cursor-pointer"
            >
              Get started — it&apos;s free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            No spam. No nonsense. Just productivity that slaps.
          </p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center shrink-0">
              <img src="/logo.png" alt="Chronos Logo" className="h-full w-full object-cover rounded-lg shadow-sm" />
            </div>
            <span className="text-sm font-semibold">Chronos</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Chronos. Designed for the generation
            that refuses to be bored.
          </p>
        </div>
      </footer>
    </div>
  );
}
