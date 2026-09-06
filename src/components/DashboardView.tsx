'use client';

import React, { useEffect, useState } from 'react';
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
  AlertTriangle,
  Target,
  FileCheck2,
  Bot
} from 'lucide-react';
import ThreeStudyOrb from './ThreeStudyOrb';
import { motion } from 'framer-motion';

interface DashboardViewProps {
  user: any;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenEmergencyModal?: () => void;
  onSelectTopic?: (topic: string, subject?: string) => void;
  theme?: 'dark' | 'light';
}

export default function DashboardView({
  user,
  setActiveTab,
  onOpenAuth,
  onOpenEmergencyModal,
  onSelectTopic,
  theme = 'dark',
}: DashboardViewProps) {
  const [targetExam, setTargetExam] = useState({
    title: 'Operating Systems & System Software',
    date: '2026-09-12',
    daysLeft: 7,
    syllabusWeight: 100
  });

  const [readinessScore, setReadinessScore] = useState(72);
  const [quickPrompt, setQuickPrompt] = useState('');
  const [visualMode, setVisualMode] = useState<'3d_interactive' | '3d_render'>('3d_interactive');

  const [todayMissions, setTodayMissions] = useState([
    {
      id: 'm1',
      title: 'Master Banker’s Algorithm Safety Check',
      subject: 'Operating Systems',
      targetTab: 'nexa',
      estimatedMins: 15,
      completed: false,
      badge: 'High-Yield 10M'
    },
    {
      id: 'm2',
      title: 'Practice 5-Mark Question: Process State Transitions',
      subject: 'Operating Systems',
      targetTab: 'practice',
      estimatedMins: 10,
      completed: false,
      badge: 'Examiner Favorite'
    },
    {
      id: 'm3',
      title: 'Review 12 Due Flashcards (Spaced Repetition)',
      subject: 'Computer Networks',
      targetTab: 'flashcards',
      estimatedMins: 8,
      completed: true,
      badge: 'Memory Retention'
    }
  ]);

  const toggleMission = (id: string) => {
    setTodayMissions(prev =>
      prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPrompt.trim()) {
      if (onSelectTopic) onSelectTopic(quickPrompt, 'General');
      setActiveTab('nexa');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 24-Hour Emergency Mode Floating Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-orange-950/70 p-3 sm:p-4 backdrop-blur-xl shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-200">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-orange-400 bg-clip-text text-transparent font-bold">
            EXAM COUNTDOWN:
          </span>
          <span className="text-slate-200">
            {targetExam.title} • <strong className="text-amber-300">{targetExam.daysLeft} Days Remaining</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onOpenEmergencyModal && onOpenEmergencyModal()}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 px-3.5 py-1.5 font-black text-white shadow-md shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Flame className="h-3.5 w-3.5 text-amber-200 animate-pulse" />
            <span>24H Emergency Mode</span>
          </button>
          <button
            onClick={() => setActiveTab('exam_center')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 font-bold text-slate-200 hover:bg-slate-700 transition-all cursor-pointer"
          >
            <Target className="h-3.5 w-3.5 text-emerald-400" />
            <span>Manage Exam Center</span>
          </button>
        </div>
      </div>

      {/* Hero Command Center */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-950/95 dark:to-indigo-950/40 p-6 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute -right-24 -top-24 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-500/15 via-pink-500/10 to-transparent blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>ScholarMate 2.0 AI Coach</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-500/15 px-3 py-1 text-xs font-bold text-purple-700 dark:text-purple-300">
                <Cpu className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span>8-Part Teaching & Examiner Engine</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Your AI{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                Exam Coach.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
              Upload your syllabus, notes, and past question papers. ScholarMate decomposes your curriculum, teaches with 8-part intuitive lessons, generates 5/10-mark answers with examiner marking schemes, and tells you when you're 100% exam ready.
            </p>

            {/* Quick Prompt Input */}
            <form onSubmit={handleHeroSearch} className="relative max-w-xl">
              <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-white/20 bg-slate-50/90 dark:bg-slate-900/80 p-1.5 shadow-lg shadow-slate-200/50 dark:shadow-2xl backdrop-blur-xl focus-within:border-emerald-500 transition-all">
                <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Ask Nexa Coach: 'Teach Banker\'s Algorithm' or '10M Normalization answer'..."
                  className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  Ask Coach
                </button>
              </div>
            </form>

            {/* 3 Primary Action Gates */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Primary Action Gates:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
                <button
                  onClick={() => setActiveTab('nexa')}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-cyan-500/30 dark:border-cyan-500/40 bg-white/90 dark:bg-gradient-to-br dark:from-cyan-950/60 dark:to-slate-900/80 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/15 active:scale-[0.98] transition-all text-left cursor-pointer group shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition-transform">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      🤖 Ask Nexa
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      Exam doubt resolution & concepts
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('library')}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-emerald-500/30 dark:border-emerald-500/40 bg-white/90 dark:bg-gradient-to-br dark:from-emerald-950/60 dark:to-slate-900/80 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/15 active:scale-[0.98] transition-all text-left cursor-pointer group shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                      📚 Study Hub
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      PDF upload & synthesis
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('practice')}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-purple-500/30 dark:border-purple-500/40 bg-white/90 dark:bg-gradient-to-br dark:from-purple-950/60 dark:to-slate-900/80 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/15 active:scale-[0.98] transition-all text-left cursor-pointer group shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 group-hover:scale-105 transition-transform">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      🧪 Exam Practice
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      5/10M model answers & recall
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Visual Orb & Floating Badges */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-full flex justify-center min-h-[390px] items-center">
              {visualMode === '3d_interactive' ? (
                <ThreeStudyOrb theme={theme} />
              ) : (
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative flex items-center justify-center py-2"
                >
                  <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-emerald-500/40 shadow-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-2 max-w-[340px] max-h-[340px]">
                    <img
                      src="/images/student-ai-core.jpg"
                      alt="ScholarMate 3D Student AI Knowledge Core - 9.8 Accuracy Rating"
                      className="w-full h-full object-cover rounded-2xl shadow-inner hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-mono font-black text-[11px] px-3 py-1 rounded-xl shadow-lg border border-emerald-300/40">
                      ★ 9.8 AI ACCURACY
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-4 -left-4 sm:left-2 rounded-2xl border border-emerald-500/40 bg-white/95 dark:bg-slate-900/85 p-3 shadow-xl backdrop-blur-xl pointer-events-none hidden sm:flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-none font-semibold">Nexa AI 2.0</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">8-Part Teaching</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute -bottom-2 -right-4 sm:right-2 rounded-2xl border border-cyan-500/40 bg-white/95 dark:bg-slate-900/85 p-3 shadow-xl backdrop-blur-xl pointer-events-none hidden sm:flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-none font-semibold">Exam Readiness</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{readinessScore}% Probability</p>
                </div>
              </motion.div>
            </div>

            {/* Visual Mode Toggle Pill Switch */}
            <div className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700 shadow-sm mt-2.5">
              <button
                type="button"
                onClick={() => setVisualMode('3d_interactive')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  visualMode === '3d_interactive'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ✨ Live 3D Simulation
              </button>
              <button
                type="button"
                onClick={() => setVisualMode('3d_render')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  visualMode === '3d_render'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🏆 9.8 Accuracy Concept
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Daily Mission & Readiness Hub */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Missions Card (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Today's High-Yield Mission
              </h2>
            </div>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
              {todayMissions.filter(m => m.completed).length} / {todayMissions.length} Complete
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nexa AI prioritized these tasks based on your upcoming exam date and mistake patterns.
          </p>

          <div className="space-y-2.5">
            {todayMissions.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  m.completed
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleMission(m.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      m.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                    }`}
                  >
                    {m.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${m.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {m.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {m.badge}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {m.subject} • ~{m.estimatedMins} mins
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onSelectTopic) onSelectTopic(m.title, m.subject);
                    setActiveTab(m.targetTab);
                  }}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  <span>Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Ring & Weakness Snapshot (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                Exam Readiness Snapshot
              </h3>
              <button
                onClick={() => setActiveTab('progress')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                Full Diagnostic <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-4 flex items-center justify-around">
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-emerald-500"
                    strokeWidth="8"
                    strokeDasharray={251}
                    strokeDashoffset={251 - (251 * readinessScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">{readinessScore}%</span>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Ready</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">⚡ Building Mastery</div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">
                  Cover 2 more units & 1 mock exam to cross the <strong>90%+ Distinction</strong> threshold.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800/40 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">2 Critical Weaknesses Tagged</span>
            </div>
            <button
              onClick={() => setActiveTab('progress')}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
            >
              Fix Now
            </button>
          </div>
        </div>
      </section>

      {/* AI & ML Engineering Development Team Showcase Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-gradient-to-b dark:from-slate-900/95 dark:via-slate-950 dark:to-indigo-950/40 p-6 sm:p-10 shadow-xl shadow-slate-200/50 dark:shadow-2xl backdrop-blur-2xl">
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                  <GraduationCap className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>AANM & VVRSR Polytechnic College</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300">
                  <Cpu className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Branch: AI & ML</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Project Development Team —{' '}
                <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                  AI & ML Engineering
                </span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Department of Artificial Intelligence & Machine Learning (AI & ML) • Final Year Major Project (2026 - 2027)
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 font-semibold text-slate-700 dark:text-slate-200">
                👥 Team of 4 Members
              </span>
              <span className="rounded-xl border border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/15 px-3.5 py-1.5 font-semibold text-indigo-700 dark:text-indigo-300">
                ⚡ GenAI & Spatial WebGL
              </span>
            </div>
          </div>

          {/* 4 Developer ID Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Member 1: Vastav */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-cyan-500/50 bg-white/95 dark:bg-gradient-to-b dark:from-cyan-950/40 dark:via-slate-900/90 dark:to-blue-950/30 p-6 shadow-lg shadow-slate-200/50 dark:shadow-xl dark:shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:border-cyan-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 font-mono font-bold text-sm">
                    01
                  </span>
                  <span className="rounded-full bg-cyan-50 dark:bg-cyan-500/20 border border-cyan-500/30 dark:border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-bold text-cyan-700 dark:text-cyan-300 shadow-sm">
                    Team Lead
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
                  <span>Vastav</span>
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping"></span>
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-cyan-950/80 border border-slate-200 dark:border-cyan-500/40 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                  <span>Role:</span>
                  <span className="text-slate-900 dark:text-white font-bold">Lead Architect</span>
                </div>
                <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300 mt-3">
                  AI Architecture & Full-Stack Lead
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 font-bold">•</span>
                    <span>ScholarMate 2.0 Blueprint System</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 font-bold">•</span>
                    <span>Nexa AI 8-Part Teaching Framework</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500 font-bold">•</span>
                    <span>6-Metric Readiness Diagnostic Engine</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-200 dark:border-cyan-500/20 text-[10px] text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                AANM & VVRSR Polytechnic • AI & ML
              </div>
            </motion.div>

            {/* Member 2: Vishnu */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-indigo-500/50 bg-white/95 dark:bg-gradient-to-b dark:from-indigo-950/40 dark:via-slate-900/90 dark:to-purple-950/30 p-6 shadow-lg shadow-slate-200/50 dark:shadow-xl dark:shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:border-indigo-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 font-mono font-bold text-sm">
                    02
                  </span>
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-500/30 dark:border-indigo-500/40 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 shadow-sm">
                    3D Graphics
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
                  <span>Vishnu</span>
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-indigo-950/80 border border-slate-200 dark:border-indigo-500/40 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  <span>Role:</span>
                  <span className="text-slate-900 dark:text-white font-bold">Three.js Specialist</span>
                </div>
                <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mt-3">
                  Three.js 3D & UI/UX Developer
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>Interactive Three.js 3D Study Orb</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>Kinetic cursor & WebGL particles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500 font-bold">•</span>
                    <span>Responsive UI styling and layouts</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-200 dark:border-indigo-500/20 text-[10px] text-indigo-700 dark:text-indigo-400 font-mono font-bold">
                AANM & VVRSR Polytechnic • AI & ML
              </div>
            </motion.div>

            {/* Member 3: Nikhileswar */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-fuchsia-500/50 bg-white/95 dark:bg-gradient-to-b dark:from-fuchsia-950/40 dark:via-slate-900/90 dark:to-purple-950/30 p-6 shadow-lg shadow-slate-200/50 dark:shadow-xl dark:shadow-fuchsia-500/10 hover:shadow-fuchsia-500/20 hover:border-fuchsia-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-fuchsia-500 to-pink-600 text-white shadow-md shadow-fuchsia-500/30 font-mono font-bold text-sm">
                    03
                  </span>
                  <span className="rounded-full bg-fuchsia-50 dark:bg-fuchsia-500/20 border border-fuchsia-500/30 dark:border-fuchsia-500/40 px-2.5 py-0.5 text-[10px] font-bold text-fuchsia-700 dark:text-fuchsia-300 shadow-sm">
                    Backend & DB
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
                  <span>Nikhileswar</span>
                  <span className="h-2 w-2 rounded-full bg-fuchsia-500 animate-ping"></span>
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-fuchsia-950/80 border border-slate-200 dark:border-fuchsia-500/40 px-2.5 py-1 text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300">
                  <span>Role:</span>
                  <span className="text-slate-900 dark:text-white font-bold">Backend Architect</span>
                </div>
                <p className="text-xs font-bold text-fuchsia-700 dark:text-fuchsia-300 mt-3">
                  Database & API Engine Architect
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-500 font-bold">•</span>
                    <span>PostgreSQL & Prisma relational schema</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-500 font-bold">•</span>
                    <span>AI In-Memory LRU & localStorage caching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-fuchsia-500 font-bold">•</span>
                    <span>7 Dedicated AI Backend Endpoints</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-200 dark:border-fuchsia-500/20 text-[10px] text-fuchsia-700 dark:text-fuchsia-400 font-mono font-bold">
                AANM & VVRSR Polytechnic • AI & ML
              </div>
            </motion.div>

            {/* Member 4: Sathvik */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-emerald-500/50 bg-white/95 dark:bg-gradient-to-b dark:from-emerald-950/40 dark:via-slate-900/90 dark:to-teal-950/30 p-6 shadow-lg shadow-slate-200/50 dark:shadow-xl dark:shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 font-mono font-bold text-sm">
                    04
                  </span>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-500/30 dark:border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 shadow-sm">
                    AI Curriculum
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
                  <span>Sathvik</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                </h3>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-emerald-950/80 border border-slate-200 dark:border-emerald-500/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <span>Role:</span>
                  <span className="text-slate-900 dark:text-white font-bold">Active Recall Lead</span>
                </div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-3">
                  Active Recall & Quiz Engine Lead
                </p>
                <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>5 & 10-mark examiner checklist models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Spaced Repetition SM-2 Flashcards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Mock Exam Simulator section pallets</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-200 dark:border-emerald-500/20 text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                AANM & VVRSR Polytechnic • AI & ML
              </div>
            </motion.div>
          </div>

          {/* Institutional Banner */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-slate-900/50 p-4 text-center text-xs text-slate-600 dark:text-slate-300 backdrop-blur-md">
            <p className="font-semibold">
              🎓 <strong className="text-slate-900 dark:text-white">AANM & VVRSR Polytechnic College</strong> • Department of Artificial Intelligence & Machine Learning (AI & ML)
            </p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Final Year Major Project (2026 - 2027) | Team: <strong className="text-cyan-700 dark:text-cyan-300">Vastav</strong> (Lead Architect), <strong className="text-indigo-700 dark:text-indigo-300">Vishnu</strong> (3D Graphics), <strong className="text-purple-700 dark:text-purple-300">Nikhileswar</strong> (Backend Architect), <strong className="text-emerald-700 dark:text-emerald-300">Sathvik</strong> (Active Recall Lead).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
