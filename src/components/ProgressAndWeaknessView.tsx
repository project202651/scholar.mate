'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, CheckCircle2, Flame, Brain, Target, 
  ArrowRight, RefreshCw, AlertTriangle, Sparkles, BookOpen, Clock, Zap, HelpCircle,
  FileText, Layers, Award
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressAndWeaknessViewProps {
  onNavigateToNexa?: (topic: string) => void;
  onNavigateToPractice?: (topic: string) => void;
  onNavigateToFocus?: (topic: string) => void;
}

interface StudentProgressData {
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
  college?: string;
  department?: string;
  year?: string;
}

export default function ProgressAndWeaknessView({
  onNavigateToNexa,
  onNavigateToPractice,
  onNavigateToFocus
}: ProgressAndWeaknessViewProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudentProgressData>({
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
          setData(json.progress);
        }
      }
    } catch (e) {
      console.error("Failed to load real progress:", e);
    } finally {
      setLoading(false);
    }
  };

  const getReadinessTier = (score: number) => {
    if (score >= 85) return { label: '🎯 Exam Ready (High Probability)', color: 'text-emerald-500', bg: 'bg-emerald-500' };
    if (score >= 70) return { label: '⚡ Building Mastery (Solid Progress)', color: 'text-blue-500', bg: 'bg-blue-500' };
    if (score >= 50) return { label: '⚠️ Needs Reinforcement (Practice Drills)', color: 'text-amber-500', bg: 'bg-amber-500' };
    return { label: '🚨 Foundational Stage (Start Active Recall)', color: 'text-rose-500', bg: 'bg-rose-500' };
  };

  const tier = getReadinessTier(data.readinessScore || 65);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-400/30">
              <Brain className="w-3.5 h-3.5" />
              <span>Real-Time Academic Performance Metrics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Student Progress & Exam Diagnostics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Calculated from your verified study sessions, textbook synthesis notes, flashcard mastery, and practice drills.
            </p>
          </div>

          {/* Readiness Score Card */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center gap-4 backdrop-blur-md shrink-0 shadow-lg">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-400/30">
                <span className="text-xl font-black text-white">{data.readinessScore}%</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exam Readiness</div>
              <div className={`text-xs font-bold ${tier.color}`}>{tier.label}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 backdrop-blur-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Study Time Logged</span>
            <Clock className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data.studyHours} <span className="text-xs font-medium text-slate-400">hours</span>
          </div>
          <p className="text-[11px] text-slate-500">Streak: {data.streakCount} days active</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 backdrop-blur-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Library Documents</span>
            <FileText className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data.docCount} <span className="text-xs font-medium text-slate-400">textbooks</span>
          </div>
          <p className="text-[11px] text-slate-500">{data.noteCount} synthesized study notes</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 backdrop-blur-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Flashcard Retention</span>
            <Layers className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data.masteredCards} / {data.totalCards || 25}
          </div>
          <p className="text-[11px] text-slate-500">Active spaced repetition cards</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-5 backdrop-blur-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Task Completion</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {data.taskCompletionRate}%
          </div>
          <p className="text-[11px] text-slate-500">{data.tasksCompleted} of {data.tasksTotal} daily tasks</p>
        </div>
      </div>

      {/* Actionable Next Steps Recommendation */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-500" />
          <span>Recommended Study Actions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div 
            onClick={() => onNavigateToPractice && onNavigateToPractice("Deadlock Handling")}
            className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 p-4 space-y-2 hover:border-emerald-500/40 transition-all cursor-pointer"
          >
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Answer Arena</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Practice 10-Mark Questions</h4>
            <p className="text-[11px] text-slate-500">Reinforce derivations and examiner marking checklists.</p>
          </div>

          <div 
            onClick={() => onNavigateToFocus && onNavigateToFocus("Exam Revision")}
            className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 p-4 space-y-2 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase">Focus Timer</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Start 25m Focus Block</h4>
            <p className="text-[11px] text-slate-500">Log deep focus study intervals towards your exam readiness.</p>
          </div>

          <div 
            onClick={() => onNavigateToNexa && onNavigateToNexa("Core Syllabus Concepts")}
            className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/50 p-4 space-y-2 hover:border-indigo-500/40 transition-all cursor-pointer"
          >
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Nexa AI</span>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Ask Doubts & Clarifications</h4>
            <p className="text-[11px] text-slate-500">Directly query textbook concepts with grounded AI explanations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
