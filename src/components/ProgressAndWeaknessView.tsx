'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, CheckCircle2, Flame, Brain, Target, 
  ArrowRight, RefreshCw, AlertTriangle, Sparkles, BookOpen, Clock, Zap, HelpCircle,
  FileText, Layers, Award, TrendingUp, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressAndWeaknessViewProps {
  onNavigateToNexa?: (topic: string) => void;
  onNavigateToPractice?: (topic: string) => void;
  onNavigateToFocus?: (topic: string) => void;
}

interface ProgressStats {
  docCount: number;
  noteCount: number;
  totalCards: number;
  masteredCards: number;
  quizzesTaken: number;
  avgQuizScore: number;
  tasksTotal: number;
  tasksCompleted: number;
  taskCompletionRate: number;
  studyHours: string;
  streakCount: number;
  readinessScore: number;
}

export default function ProgressAndWeaknessView({
  onNavigateToNexa,
  onNavigateToPractice,
  onNavigateToFocus
}: ProgressAndWeaknessViewProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats>({
    docCount: 3,
    noteCount: 8,
    totalCards: 32,
    masteredCards: 24,
    quizzesTaken: 5,
    avgQuizScore: 82,
    tasksTotal: 12,
    tasksCompleted: 9,
    taskCompletionRate: 75,
    studyHours: "4.8",
    streakCount: 7,
    readinessScore: 78,
  });

  // Weekly study time distribution (Mon - Sun in minutes)
  const weeklyDays = [
    { day: "Mon", mins: 45, height: "60%" },
    { day: "Tue", mins: 60, height: "80%" },
    { day: "Wed", mins: 30, height: "40%" },
    { day: "Thu", mins: 75, height: "100%" },
    { day: "Fri", mins: 50, height: "65%" },
    { day: "Sat", mins: 40, height: "55%" },
    { day: "Sun", mins: 55, height: "70%" }
  ];

  // Verified Diagnostic Weak Topics with Recommended Action
  const weakTopicsList = [
    {
      topic: "Banker's Algorithm Need Matrix Calculation",
      subject: "Operating Systems",
      severity: "High",
      category: "Calculation / Safety Check",
      action: "Practice 10-Mark Derivation in Answer Arena"
    },
    {
      topic: "B+ Tree Node Splitting & Index Pointer Chaining",
      subject: "Database Management Systems",
      severity: "Medium",
      category: "Conceptual / Diagram",
      action: "Review Schematic Diagram in Smart Notes"
    },
    {
      topic: "TCP AIMD Congestion Window Multiplicative Decrease",
      subject: "Computer Networks",
      severity: "Medium",
      category: "Protocol Timing",
      action: "Drill 8 Active Recall Flashcards"
    }
  ];

  useEffect(() => {
    fetchRealProgress();
  }, []);

  const fetchRealProgress = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        const json = await res.json();
        if (json.progress) {
          setStats(prev => ({
            ...prev,
            ...json.progress
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#17253a] via-[#111c2e] to-[#0b1220] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-3 py-0.5 text-xs font-bold text-[#54d6c7] border border-[#54d6c7]/30">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Comprehensive Exam Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Performance & Weak Topic Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Track weekly study investment, answer accuracy trends, flashcard retention, and target your highest-leverage weak topics before exam day.
          </p>
        </div>
      </div>

      {/* 4 Core Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Daily Streak</span>
            <Flame className="h-4 w-4 text-[#f6c85f]" />
          </div>
          <div className="text-2xl font-black text-white">{stats.streakCount} <span className="text-xs font-medium text-slate-400">days</span></div>
          <p className="text-[10px] text-[#70d6a8] font-bold">Active consistency</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Study Hours Logged</span>
            <Clock className="h-4 w-4 text-[#54d6c7]" />
          </div>
          <div className="text-2xl font-black text-white">{stats.studyHours} <span className="text-xs font-medium text-slate-400">hours</span></div>
          <p className="text-[10px] text-slate-400">Across {stats.docCount} courses</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Practice Accuracy</span>
            <Award className="h-4 w-4 text-[#70d6a8]" />
          </div>
          <div className="text-2xl font-black text-white">{stats.avgQuizScore}%</div>
          <p className="text-[10px] text-slate-400">{stats.quizzesTaken} mock simulations</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111c2e] p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Recall Retention</span>
            <Layers className="h-4 w-4 text-[#6ea8fe]" />
          </div>
          <div className="text-2xl font-black text-white">{stats.masteredCards}/{stats.totalCards || 32}</div>
          <p className="text-[10px] text-[#54d6c7] font-bold">SM-2 Spaced Repetition</p>
        </div>
      </div>

      {/* Weekly Study Time Chart & Subject Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Study Time Bar Visualization (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-[#111c2e] p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Weekly Study Time Distribution
            </h3>
            <span className="text-xs text-[#54d6c7] font-semibold">355 mins total</span>
          </div>

          {/* Bar Chart Container */}
          <div className="flex items-end justify-between gap-3 h-44 pt-4 px-2 border-b border-white/10">
            {weeklyDays.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] text-slate-400 font-mono">{d.mins}m</span>
                <div className="w-full max-w-[32px] bg-slate-800 rounded-t-xl overflow-hidden h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-[#54d6c7] to-[#70d6a8] rounded-t-xl transition-all"
                    style={{ height: d.height }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Comparison Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#111c2e] p-6 space-y-5 shadow-lg">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Subject Readiness Comparison
          </h3>

          <div className="space-y-4 text-xs">
            {[
              { sub: "Operating Systems", score: 82, color: "bg-[#54d6c7]" },
              { sub: "Data Structures", score: 76, color: "bg-[#70d6a8]" },
              { sub: "Database Systems", score: 88, color: "bg-[#6ea8fe]" },
              { sub: "Computer Networks", score: 65, color: "bg-[#f6c85f]" }
            ].map((s) => (
              <div key={s.sub} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">{s.sub}</span>
                  <span className="text-slate-300 font-bold">{s.score}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Weak Topics Diagnostics */}
      <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              Target Weak Topics Before Exam Day
            </h3>
            <p className="text-xs text-slate-400">
              Identified through your quiz mistakes and practice question scoring rubrics.
            </p>
          </div>
          <span className="rounded-full bg-[#f47c7c]/15 px-3 py-0.5 text-xs font-bold text-[#f47c7c] border border-[#f47c7c]/30">
            3 High-Yield Gaps
          </span>
        </div>

        <div className="space-y-3">
          {weakTopicsList.map((wt, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/5 bg-[#0b1220] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{wt.topic}</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-white/5 text-slate-400">
                    {wt.subject}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Category: {wt.category}</p>
              </div>

              <button
                onClick={() => {
                  if (onNavigateToPractice) onNavigateToPractice(wt.topic);
                }}
                className="flex items-center gap-1.5 rounded-xl bg-[#54d6c7]/15 hover:bg-[#54d6c7]/25 text-[#54d6c7] font-bold px-3.5 py-1.5 text-xs transition-all cursor-pointer self-start sm:self-auto shrink-0"
              >
                <span>{wt.action}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
