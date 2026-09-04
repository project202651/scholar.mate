"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  BookOpen,
  BrainCircuit,
  Layers,
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileText,
  Flame,
  ArrowRight,
  School,
  Clock,
  Users,
  Cpu,
  Code2,
  GraduationCap,
  ShieldCheck,
  Zap,
  Search,
  Check,
  Headphones,
  FileCheck,
  Lightbulb,
} from "lucide-react";
import ThreeStudyOrb from "./ThreeStudyOrb";
import { motion } from "framer-motion";

interface DashboardViewProps {
  user: any;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export default function DashboardView({ user, setActiveTab, onOpenAuth }: DashboardViewProps) {
  const [stats, setStats] = useState<any>({
    docCount: 0,
    noteCount: 0,
    totalCards: 0,
    masteredCards: 0,
    quizzesTaken: 0,
    avgQuizScore: 0,
    tasksTotal: 0,
    tasksCompleted: 0,
    taskCompletionRate: 0,
    studyHours: "0.0",
    streakCount: 1,
    readinessScore: 65,
  });
  const [quickPrompt, setQuickPrompt] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          const data = await res.json();
          if (data.progress) setStats(data.progress);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    fetchProgress();
  }, [user]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setActiveTab("chat");
    } else {
      onOpenAuth();
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Cybernetic Semester Exam Notice Ticker */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-indigo-950/60 p-3 sm:p-4 backdrop-blur-xl shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent font-bold">
            SEMESTER EXAMS 2026-27 SPRINT:
          </span>
          <span className="hidden md:inline text-slate-300">
            AANM & VVRSR Polytechnic • Dept. of AI & ML Academic Portal
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab(user ? "timer" : "dashboard")}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-3 py-1.5 font-bold text-white shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Launch Study Timer</span>
          </button>
          <button
            onClick={() => setActiveTab(user ? "chat" : "dashboard")}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-slate-800/80 px-3 py-1.5 font-bold text-cyan-300 hover:bg-slate-700 transition-all"
          >
            <BrainCircuit className="h-3.5 w-3.5 text-cyan-400" />
            <span>Ask Nexa AI</span>
          </button>
        </div>
      </div>

      {/* Hero Command Center Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-indigo-950/40 p-6 sm:p-12 shadow-2xl backdrop-blur-2xl">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Ambient neon spotlights */}
        <div className="absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-cyan-500/20 via-indigo-500/15 to-transparent blur-[140px] pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/15 to-transparent blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3.5 py-1 text-xs font-bold text-cyan-300 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                <span>Nexa AI 3.0 Study Suite</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 px-3 py-1 text-xs font-bold text-purple-300">
                <Cpu className="h-3.5 w-3.5 text-purple-400" />
                <span>AI & ML Final Year Project</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>SBTET / Polytechnic Syllabus</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Study Smarter.{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                Score 90%+
              </span>{" "}
              With Your Personal AI.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Engineered by <strong className="text-cyan-300">4 AI & ML Students</strong> at{" "}
              <strong className="text-white">AANM & VVRSR Polytechnic College</strong>. ScholarMate features{" "}
              <strong className="text-cyan-300">Nexa AI</strong> for step-by-step doubt solving, 3D active-recall flashcards,
              custom Pomodoro study timers with binaural audio, and instant 5 & 10 mark exam generators.
            </p>

            {/* Quick Interactive Prompt Search Box */}
            <form onSubmit={handleHeroSearch} className="relative max-w-xl">
              <div className="relative flex items-center rounded-2xl border border-white/20 bg-slate-900/80 p-1.5 shadow-2xl backdrop-blur-xl focus-within:border-cyan-400 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all">
                <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Ask Nexa: 'Explain Normalization in DBMS' or 'Derive Backprop'..."
                  className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
                >
                  Ask Nexa AI
                </button>
              </div>
            </form>

            {/* Quick Feature Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Quick Launch:</span>
              <button
                onClick={() => setActiveTab(user ? "chat" : "dashboard")}
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-cyan-300 hover:bg-cyan-500/20 transition-colors font-medium"
              >
                🤖 Nexa Doubt Solver
              </button>
              <button
                onClick={() => setActiveTab(user ? "timer" : "dashboard")}
                className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-indigo-300 hover:bg-indigo-500/20 transition-colors font-medium"
              >
                ⏱️ Pomodoro Timer
              </button>
              <button
                onClick={() => setActiveTab(user ? "flashcards" : "dashboard")}
                className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-purple-300 hover:bg-purple-500/20 transition-colors font-medium"
              >
                ⚡ 3D Flashcards
              </button>
            </div>
          </div>

          {/* Right 3D Visual Column with Floating Stat Badges */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full flex justify-center">
              <ThreeStudyOrb />

              {/* Floating Glass Pill 1 (Top Left) */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-4 -left-4 sm:left-2 rounded-2xl border border-cyan-500/40 bg-slate-900/80 p-3 shadow-xl backdrop-blur-xl pointer-events-none hidden sm:flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 leading-none">AI Response Engine</p>
                  <p className="text-xs font-bold text-white mt-0.5">Google Gemini 3.0</p>
                </div>
              </motion.div>

              {/* Floating Glass Pill 2 (Bottom Right) */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute -bottom-2 -right-4 sm:right-2 rounded-2xl border border-purple-500/40 bg-slate-900/80 p-3 shadow-xl backdrop-blur-xl pointer-events-none hidden sm:flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 leading-none">Active Recall</p>
                  <p className="text-xs font-bold text-white mt-0.5">3D Interactive Cards</p>
                </div>
              </motion.div>
            </div>
            <span className="inline-block rounded-full border border-indigo-500/30 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-md mt-2">
              ✨ Interactive 3D WebGL Neural Orb (Drag with Mouse)
            </span>
          </div>
        </div>
      </section>

      {/* Student Progress Metric Hub (Shown if logged in) */}
      {user && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Student Academic Hub</span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                Live Sync
              </span>
            </h2>
            <span className="text-xs text-slate-400">
              Department: <strong className="text-cyan-300">{user.department || "AI & ML"}</strong> • Year: <strong className="text-indigo-300">{user.year || "Final Year"}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Exam Readiness */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-indigo-500/50 bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-purple-950/40 p-5 shadow-xl shadow-indigo-500/10 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Exam Readiness
                </span>
                <Award className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{stats.readinessScore}%</span>
                <span className="text-xs text-emerald-400 font-semibold">Distinction Pace</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 transition-all duration-1000 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                  style={{ width: `${stats.readinessScore}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Based on notes, tests & flashcards</p>
            </motion.div>

            {/* Study Time */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-cyan-500/50 bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-blue-950/40 p-5 shadow-xl shadow-cyan-500/10 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  Study Hours
                </span>
                <Clock className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{stats.studyHours}h</span>
                <span className="text-xs text-cyan-400 font-semibold">Focus Time</span>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                🔥 Streak: <strong className="text-amber-400">{stats.streakCount} Days Active</strong>
              </p>
            </motion.div>

            {/* Quiz Accuracy */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-purple-500/50 bg-gradient-to-br from-purple-950/60 via-slate-900/90 to-pink-950/40 p-5 shadow-xl shadow-purple-500/10 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Quiz Accuracy
                </span>
                <BrainCircuit className="h-5 w-5 text-purple-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{stats.avgQuizScore}%</span>
                <span className="text-xs text-purple-400 font-semibold">Average Score</span>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Completed: <strong className="text-slate-200">{stats.quizzesTaken} Quizzes Taken</strong>
              </p>
            </motion.div>

            {/* Daily Tasks */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-emerald-500/50 bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-teal-950/40 p-5 shadow-xl shadow-emerald-500/10 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Tasks Finished
                </span>
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {stats.tasksCompleted} / {stats.tasksTotal}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  {stats.taskCompletionRate}%
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Mastered: <strong className="text-slate-200">{stats.masteredCards} Flashcards</strong>
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Core AI Study Suite Bento Grid */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Interactive AI Study Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Everything polytechnic and engineering students need for rapid revision & active recall.
            </p>
          </div>
          <span className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300">
            7 Specialized AI Modules
          </span>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bento 1: Nexa AI Doubt Solver (Large 2-Column Spotlight) */}
          <div
            onClick={() => setActiveTab(user ? "chat" : "dashboard")}
            className="md:col-span-2 group cursor-pointer relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-blue-950/30 p-6 sm:p-8 transition-all hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                      <span>Nexa AI Doubt Solver</span>
                      <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/40">
                        24/7 ONLINE
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Syllabus-grounded Academic Companion</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
                  Google Gemini 3.0
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Ask Nexa AI anything: theoretical derivations, 5-mark and 10-mark exam structures, programming logic, or numerical problems. Nexa gives step-by-step solutions formatted precisely for maximum semester scoring.
              </p>

              {/* Sample question pills inside the bento */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="rounded-full border border-cyan-500/30 bg-slate-900/80 px-3 py-1 text-[11px] text-cyan-300">
                  🎯 5 & 10 Marks Exam Format
                </span>
                <span className="rounded-full border border-indigo-500/30 bg-slate-900/80 px-3 py-1 text-[11px] text-indigo-300">
                  💡 Intuitive ELI5 Explanations
                </span>
                <span className="rounded-full border border-purple-500/30 bg-slate-900/80 px-3 py-1 text-[11px] text-purple-300">
                  ⚙️ Step-by-Step Proofs
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-slate-900/80 px-3 py-1 text-[11px] text-emerald-300">
                  💻 Python & C Code
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-cyan-500/20 pt-4 text-xs font-bold text-cyan-400">
              <span className="flex items-center gap-1.5">
                <span>Start chatting with Nexa</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </span>
              <span className="text-slate-400 font-normal">Active Tutor • Instant Responses</span>
            </div>
          </div>

          {/* Bento 2: Student Focus Timer (1-Column Spotlight) */}
          <div
            onClick={() => setActiveTab(user ? "timer" : "dashboard")}
            className="group cursor-pointer relative overflow-hidden rounded-3xl border border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-orange-950/30 p-6 sm:p-8 transition-all hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-500/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                  POMODORO
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                  Student Study Timer
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  25/5m Pomodoro cycles, 50m deep work sessions, and exam simulation mode with built-in ambient Pink Noise & 10Hz Alpha Focus audio.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/30 bg-slate-950/60 p-3 text-center">
                <span className="text-xl font-mono font-black text-rose-300">25:00 • 50:00 • Exam</span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 mt-0.5 font-semibold">
                  Auto-syncs Study Hours to Profile
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-rose-500/20 pt-4 text-xs font-bold text-rose-400">
              <span className="flex items-center gap-1.5">
                <span>Start Focus Session</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </div>
          </div>

          {/* Bento 3: Smart Notes & Summaries */}
          <div
            onClick={() => setActiveTab(user ? "notes" : "dashboard")}
            className="group cursor-pointer relative overflow-hidden rounded-3xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-purple-950/30 p-6 transition-all hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                Smart Notes & Summarizer
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Condenses large chapters into 3-paragraph executive summaries, high-yield bullet points, and 5-mark / 10-mark exam questions with full answers.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-indigo-400 gap-1 border-t border-indigo-500/20 pt-3">
              <span>Generate revision notes</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento 4: 3D Interactive Flashcards */}
          <div
            onClick={() => setActiveTab(user ? "flashcards" : "dashboard")}
            className="group cursor-pointer relative overflow-hidden rounded-3xl border border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/40 via-slate-900/90 to-pink-950/30 p-6 transition-all hover:border-fuchsia-400 hover:shadow-xl hover:shadow-fuchsia-500/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-pink-600 text-white shadow-md shadow-fuchsia-500/30 group-hover:scale-105 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-fuchsia-400 transition-colors">
                3D Interactive Flashcards
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Active recall practice with 3D animated flip cards. Mark mastered cards to lock key formulas, laws, and definitions into permanent memory.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-fuchsia-400 gap-1 border-t border-fuchsia-500/20 pt-3">
              <span>Practice 3D flashcards</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento 5: AI Speed Quiz Arena */}
          <div
            onClick={() => setActiveTab(user ? "quiz" : "dashboard")}
            className="group cursor-pointer relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-orange-950/30 p-6 transition-all hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30 group-hover:scale-105 transition-transform">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                AI Speed Quiz Arena
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Auto-generate timed multiple-choice questions from your syllabus. Instant answer evaluation, confidence tracking, and mistake review.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-amber-400 gap-1 border-t border-amber-500/20 pt-3">
              <span>Take a speed quiz</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento 6: AI Study Timetable */}
          <div
            onClick={() => setActiveTab(user ? "schedule" : "dashboard")}
            className="group cursor-pointer relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-teal-950/30 p-6 transition-all hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                AI Study Timetable
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Input your exam dates and subjects. AI generates a balanced day-by-day revision schedule to ensure zero last-minute panic.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-emerald-400 gap-1 border-t border-emerald-500/20 pt-3">
              <span>View study timetable</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bento 7: Document & Notes Hub */}
          <div
            onClick={() => setActiveTab(user ? "docs" : "dashboard")}
            className="group cursor-pointer relative overflow-hidden rounded-3xl border border-blue-500/40 bg-gradient-to-br from-blue-950/40 via-slate-900/90 to-cyan-950/30 p-6 transition-all hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20 backdrop-blur-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-600 text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                Document Knowledge Hub
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upload textbook PDFs, lecture slides, and handwritten notes. Nexa AI reads them directly to formulate accurate exam answers.
              </p>
            </div>
            <div className="mt-5 flex items-center text-xs font-bold text-blue-400 gap-1 border-t border-blue-500/20 pt-3">
              <span>Upload PDF materials</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* AI & ML Engineering Development Team Showcase Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-slate-900/95 via-slate-950 to-indigo-950/40 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        {/* Glow ambient lights */}
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
                  <span>AANM & VVRSR Polytechnic College</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                  <Cpu className="h-3.5 w-3.5 text-purple-400" />
                  <span>Branch: AI & ML</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Project Development Team —{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  AI & ML Engineering
                </span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Department of Artificial Intelligence & Machine Learning (AI & ML) • Final Year Major Project (2026 - 2027)
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 font-semibold text-slate-200">
                👥 Team of 4 Members
              </span>
              <span className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-3.5 py-1.5 font-semibold text-indigo-300">
                ⚡ GenAI & Spatial WebGL
              </span>
            </div>
          </div>

          {/* Institutional Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">College</span>
              <span className="text-xs font-bold text-white mt-1 block">AANM & VVRSR Polytechnic</span>
            </div>
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold block">Department</span>
              <span className="text-xs font-bold text-cyan-300 mt-1 block">AI & ML Engineering</span>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Academic Year</span>
              <span className="text-xs font-bold text-white mt-1 block">2026 - 2027 (Final Year)</span>
            </div>
            <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-purple-300 font-semibold block">Core AI Engine</span>
              <span className="text-xs font-bold text-purple-300 mt-1 block">Google Gemini 3.0</span>
            </div>
          </div>

          {/* 4 Developer ID Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Member 1: Vastav */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl border border-cyan-500/50 bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-blue-950/30 p-6 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 font-mono font-bold text-sm">
                    01
                  </span>
                  <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 shadow-sm">
                    Team Lead
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>Vastav</span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 text-xs font-mono font-bold text-cyan-300">
                  <span>PIN:</span>
                  <span className="text-white">24030-AIM-026</span>
                </div>
                <p className="text-xs font-bold text-cyan-300 mt-3">
                  AI Architecture & Full-Stack Lead
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Google Gemini 3 Neural Integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Multi-turn Nexa Doubt Solver tutor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Full-stack state & API security</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-cyan-500/20 text-[10px] text-cyan-400 font-mono font-bold">
                AANM & VVRSR Polytechnic • AI & ML
              </div>
            </motion.div>

            {/* Member 2: Vishnu */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl border border-indigo-500/50 bg-gradient-to-b from-indigo-950/40 via-slate-900/90 to-purple-950/30 p-6 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/30 hover:border-indigo-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 font-mono font-bold text-sm">
                    02
                  </span>
                  <span className="rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 shadow-sm">
                    3D Graphics
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>Vishnu</span>
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping"></span>
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 px-2.5 py-1 text-xs font-mono font-bold text-indigo-300">
                  <span>PIN:</span>
                  <span className="text-white">24030-AIM-020</span>
                </div>
                <p className="text-xs font-bold text-indigo-300 mt-3">
                  Three.js 3D & UI/UX Developer
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>Interactive Three.js 3D Study Orb</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>Kinetic cursor & WebGL particles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>Starting boot sequence splash screen</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-indigo-500/20 text-[10px] text-indigo-400 font-mono font-bold">
                AANM & VVRSR Polytechnic • AI & ML
              </div>
            </motion.div>

            {/* Member 3: Nikhileswar */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl border border-fuchsia-500/50 bg-gradient-to-b from-fuchsia-950/40 via-slate-900/90 to-purple-950/30 p-6 shadow-xl shadow-fuchsia-500/10 hover:shadow-fuchsia-500/30 hover:border-fuchsia-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-pink-600 text-white shadow-md shadow-fuchsia-500/30 font-mono font-bold text-sm">
                    03
                  </span>
                  <span className="rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 px-2.5 py-0.5 text-[10px] font-bold text-fuchsia-300 shadow-sm">
                    Backend & DB
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>Nikhileswar</span>
                  <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-ping"></span>
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-fuchsia-950/80 border border-fuchsia-500/40 px-2.5 py-1 text-xs font-mono font-bold text-fuchsia-300">
                  <span>PIN:</span>
                  <span className="text-white">24030-AIM-051</span>
                </div>
                <p className="text-xs font-bold text-fuchsia-300 mt-3">
                  Database & API Engine Architect
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-400 font-bold">•</span>
                    <span>Prisma SQLite relational models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-400 font-bold">•</span>
                    <span>Student JWT authentication & bcrypt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-400 font-bold">•</span>
                    <span>PDF parser & document storage API</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-fuchsia-500/20 text-[10px] text-fuchsia-400 font-mono font-bold">
                AANM & VVRSR Polytechnic • AI & ML
              </div>
            </motion.div>

            {/* Member 4: Sathvik */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl border border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-teal-950/30 p-6 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 font-mono font-bold text-sm">
                    04
                  </span>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 shadow-sm">
                    AI Curriculum
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>Sathvik</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 text-xs font-mono font-bold text-emerald-300">
                  <span>PIN:</span>
                  <span className="text-white">24030-AIM-022</span>
                </div>
                <p className="text-xs font-bold text-emerald-300 mt-3">
                  Active Recall & Quiz Engine Lead
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>3, 5 & 10-mark exam question prompts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Active-recall 3D flashcards deck</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Timed MCQ generation & scoring</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-emerald-500/20 text-[10px] text-emerald-400 font-mono font-bold">
                AANM & VVRSR Polytechnic • AI & ML
              </div>
            </motion.div>
          </div>

          {/* Development Team Institutional Banner */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-center text-xs text-slate-300 backdrop-blur-md">
            <p className="font-semibold">
              🎓 <strong className="text-white">AANM & VVRSR Polytechnic College</strong> • Department of Artificial Intelligence & Machine Learning (AI & ML)
            </p>
            <p className="text-slate-400 mt-1">
              Final Year Major Project (2026 - 2027) | Team: <strong className="text-cyan-300">Vastav (24030-AIM-026)</strong>, <strong className="text-indigo-300">Vishnu (24030-AIM-020)</strong>, <strong className="text-purple-300">Nikhileswar (24030-AIM-051)</strong>, <strong className="text-emerald-300">Sathvik (24030-AIM-022)</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
