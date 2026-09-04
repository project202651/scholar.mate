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
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProgress = async () => {
      setLoadingStats(true);
      try {
        const res = await fetch("/api/progress");
        if (res.ok) {
          const data = await res.json();
          if (data.progress) setStats(data.progress);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchProgress();
  }, [user]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section with 3D Graphic */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/40 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Glow ambient circle */}
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
                <span>Next-Gen Study Acceleration</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                <Cpu className="h-3.5 w-3.5 text-indigo-400" />
                <span>Branch: AI & ML (2026-2027)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                <Users className="h-3.5 w-3.5 text-purple-400" />
                <span>4-Member Development Team</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Master Your Exams with{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                AI Speed & Precision
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Designed & developed by a team of <strong className="text-cyan-300">4 AI & ML Students</strong> at{" "}
              <strong className="text-white">AANM & VVRSR Polytechnic College</strong> for their Final Year Major Project (2026-2027).
              Empowering polytechnic students with Google Gemini 3 AI tutoring, high-yield exam questions (3, 5 & 10 marks),
              active-recall 3D flashcards, and automated smart revision plans.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {user ? (
                <>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <BrainCircuit className="h-4 w-4" />
                    <span>Ask Nexa AI Bot</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("timer")}
                    className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-all active:scale-95 shadow-sm"
                  >
                    <Clock className="h-4 w-4 text-cyan-400 animate-pulse" />
                    <span>Focus Study Timer</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700/80 hover:text-white transition-all"
                  >
                    <BookOpen className="h-4 w-4 text-indigo-400" />
                    <span>Smart Notes</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
                >
                  <School className="h-4 w-4" />
                  <span>Get Started (Polytechnic Student Login)</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right 3D Visual Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative">
              <ThreeStudyOrb />
              <div className="text-center mt-[-20px] pointer-events-none">
                <span className="inline-block rounded-full border border-indigo-500/30 bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-md">
                  Interactive 3D Study Engine (Move Mouse)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics & Progress Metrics */}
      {user && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <span>Real-Time Study Analytics & Progress</span>
            </h2>
            <span className="text-xs text-slate-400">
              Department: <span className="text-slate-200 font-semibold">{user.department}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Exam Readiness Card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-900/80 p-5 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Exam Readiness
                </span>
                <Award className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {stats.readinessScore}%
                </span>
                <span className="text-xs text-emerald-400 font-medium">On Track</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000"
                  style={{ width: `${stats.readinessScore}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Based on notes, quizzes & tasks</p>
            </motion.div>

            {/* Study Time Card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 to-slate-900/80 p-5 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                  Study Hours
                </span>
                <Clock className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {stats.studyHours}h
                </span>
                <span className="text-xs text-cyan-400 font-medium">Invested</span>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                🔥 Streak: <strong className="text-amber-400">{stats.streakCount} Days Active</strong>
              </p>
            </motion.div>

            {/* Quizzes & Recall */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/30 to-slate-900/80 p-5 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Quiz Accuracy
                </span>
                <BrainCircuit className="h-5 w-5 text-purple-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {stats.avgQuizScore}%
                </span>
                <span className="text-xs text-purple-400 font-medium">Average</span>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Completed: <strong className="text-slate-200">{stats.quizzesTaken} Quizzes</strong>
              </p>
            </motion.div>

            {/* Daily Tasks */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-slate-900/80 p-5 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Tasks Done
                </span>
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {stats.tasksCompleted} / {stats.tasksTotal}
                </span>
                <span className="text-xs text-emerald-400 font-medium">
                  {stats.taskCompletionRate}%
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Active recall items: <strong className="text-slate-200">{stats.masteredCards} Mastered</strong>
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Feature Navigation Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Core AI Study Suite</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Nexa AI Doubt Solver */}
          <div
            onClick={() => setActiveTab(user ? "chat" : "dashboard")}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
              <span>Nexa AI Doubt Solver</span>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">24/7</span>
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Ask Nexa AI for step-by-step answers, 5 & 10 mark exam structures, code snippets, and intuitive derivations tailored for polytechnic exams.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-cyan-400 gap-1">
              <span>Chat with Nexa AI</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Smart Notes & Summarizer */}
          <div
            onClick={() => setActiveTab(user ? "notes" : "dashboard")}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-indigo-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
              Smart Notes & Summarizer
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Turn long PDF chapters into concise 3-paragraph summaries, auto bullet points, and
              high-yield 5-mark & 10-mark exam questions.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-400 gap-1">
              <span>Generate revision notes</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: 3D Flashcards */}
          <div
            onClick={() => setActiveTab(user ? "flashcards" : "dashboard")}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-purple-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-purple-500/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-purple-400 transition-colors">
              3D Interactive Flashcards
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Active recall practice with 3D animated card flips. Mark cards as mastered to lock
              formulas and definitions into long-term memory.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-400 gap-1">
              <span>Practice flashcards</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: AI Quiz Arena */}
          <div
            onClick={() => setActiveTab(user ? "quiz" : "dashboard")}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-amber-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-amber-500/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              AI Speed Quiz Arena
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Auto-generate 5-question timed multiple choice quizzes from your notes. Instant answer
              evaluations and performance reports.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-400 gap-1">
              <span>Take a quiz</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: AI Timetable & Schedule */}
          <div
            onClick={() => setActiveTab(user ? "schedule" : "dashboard")}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-emerald-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-emerald-500/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              AI Study Timetable
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Input your semester exam date and subjects. AI generates a balanced day-by-day revision
              schedule so you never have to cram at the last minute.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 gap-1">
              <span>View study plan</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Document Upload Hub */}
          <div
            onClick={() => setActiveTab(user ? "docs" : "dashboard")}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-blue-400 transition-colors">
              Document & Notes Hub
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Upload PDF textbooks, lecture slides, syllabus copies, or handwritten notes. Your
              knowledge base for all AI study tools.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 gap-1">
              <span>Upload materials</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 7: Student Study & Focus Timer */}
          <div
            onClick={() => setActiveTab(user ? "timer" : "dashboard")}
            className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-cyan-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
              <span>Student Focus Timer</span>
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300">Pomodoro</span>
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Scientific 25/5m Pomodoro cycles, 50m deep work sessions, exam pressure countdowns, and Web Audio focus ambience with auto progress tracking.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-cyan-400 gap-1">
              <span>Start focus timer</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* AI & ML Student Development Team Showcase Section */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/95 via-slate-950 to-indigo-950/40 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Glow ambient lights */}
        <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

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
              <span className="rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 font-medium text-slate-200">
                👥 Team of 4 Members
              </span>
              <span className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 px-3.5 py-1.5 font-medium text-indigo-300">
                ⚡ Full-Stack & GenAI
              </span>
            </div>
          </div>

          {/* Institutional & Project Meta Info Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">College</span>
              <span className="text-xs font-bold text-white mt-1 block">AANM & VVRSR Polytechnic</span>
            </div>
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold block">Department</span>
              <span className="text-xs font-bold text-cyan-300 mt-1 block">AI & ML (Artificial Intelligence)</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Academic Year</span>
              <span className="text-xs font-bold text-white mt-1 block">2026 - 2027 (Final Year)</span>
            </div>
            <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-3.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-purple-300 font-semibold block">Core AI Engine</span>
              <span className="text-xs font-bold text-purple-300 mt-1 block">Google Gemini 3 Flash</span>
            </div>
          </div>

          {/* 4 Team Member Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Member 1: Vastav */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-mono font-bold text-sm">
                    01
                  </span>
                  <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300">
                    Team Lead
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white tracking-wide">
                  Vastav
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 text-[11px] font-mono font-semibold text-cyan-300">
                  <span>PIN:</span>
                  <span className="text-white">24030-AIM-026</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 mt-1">
                  Branch: AI & ML (2026-27)
                </p>
                <p className="text-xs font-semibold text-cyan-200 mt-2">
                  AI Architecture & Full-Stack Lead
                </p>
                <ul className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Google Gemini 3 Neural Integration</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Multi-turn Doubt Solver tutor engine</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>Full-stack state & API key security</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] text-cyan-400/80 font-mono">
                AANM & VVRSR Polytechnic
              </div>
            </motion.div>

            {/* Member 2: Vishnu */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-mono font-bold text-sm">
                    02
                  </span>
                  <span className="rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                    3D Graphics
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white tracking-wide">
                  Vishnu
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-mono font-semibold text-indigo-300">
                  <span>PIN:</span>
                  <span className="text-white">24030-AIM-020</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 mt-1">
                  Branch: AI & ML (2026-27)
                </p>
                <p className="text-xs font-semibold text-indigo-200 mt-2">
                  Three.js 3D & UI/UX Developer
                </p>
                <ul className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>Interactive Three.js 3D Study Orb</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>Kinetic cursor & ripple shockwaves</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>Starting boot sequence animation</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] text-indigo-400/80 font-mono">
                AANM & VVRSR Polytechnic
              </div>
            </motion.div>

            {/* Member 3: Nikhileswar */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-purple-500/40 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 font-mono font-bold text-sm">
                    03
                  </span>
                  <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300">
                    Backend & DB
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white tracking-wide">
                  Nikhileswar
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 text-[11px] font-mono font-semibold text-purple-300">
                  <span>PIN:</span>
                  <span className="text-white">24030-AIM-051</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 mt-1">
                  Branch: AI & ML (2026-27)
                </p>
                <p className="text-xs font-semibold text-purple-200 mt-2">
                  Database & API Engine Architect
                </p>
                <ul className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>Prisma SQLite relational models</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>Student JWT authentication & bcrypt</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>PDF parser & document storage</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] text-purple-400/80 font-mono">
                AANM & VVRSR Polytechnic
              </div>
            </motion.div>

            {/* Member 4: Sathvik */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-sm">
                    04
                  </span>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                    AI Curriculum
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white tracking-wide">
                  Sathvik
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-300">
                  <span>PIN:</span>
                  <span className="text-white">24030-AIM-022</span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 mt-1">
                  Branch: AI & ML (2026-27)
                </p>
                <p className="text-xs font-semibold text-emerald-200 mt-2">
                  Active Recall & Quiz Engine Lead
                </p>
                <ul className="mt-3 space-y-1.5 text-[11px] text-slate-400">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>3, 5 & 10-mark exam question prompts</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>Active-recall 3D flashcards deck</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>AI speed quiz & timetable scheduler</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800 text-[10px] text-emerald-400/80 font-mono">
                AANM & VVRSR Polytechnic
              </div>
            </motion.div>
          </div>

          {/* Development Team Institutional Banner */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 text-center text-xs text-slate-300">
            <p>
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
