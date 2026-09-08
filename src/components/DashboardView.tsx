'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Layers,
  Award,
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileText,
  Flame,
  ArrowRight,
  Clock,
  Zap,
  Search,
  Target,
  FileCheck2,
  Bot
} from 'lucide-react';
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
  const [quickPrompt, setQuickPrompt] = useState('');

  const targetExam = {
    title: 'Computer Engineering Semester Exams',
    daysLeft: 14,
    readiness: 78
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPrompt.trim()) {
      if (onSelectTopic) onSelectTopic(quickPrompt, 'General');
      setActiveTab('nexa');
    }
  };

  const studyPillars = [
    {
      id: 'library',
      title: 'Smart Notes & Docs',
      desc: 'AI-structured textbook summaries with 10-part analysis',
      icon: BookOpen,
      color: 'from-blue-500/20 to-indigo-500/20',
      border: 'border-blue-500/30',
      textAccent: 'text-blue-500 dark:text-blue-400',
      actionText: 'Open Library'
    },
    {
      id: 'flashcards',
      title: 'Active Recall Deck',
      desc: '3D interactive spaced repetition cards with SM-2',
      icon: Layers,
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      textAccent: 'text-purple-500 dark:text-purple-400',
      actionText: 'Review Cards'
    },
    {
      id: 'mock_exams',
      title: 'Mock Simulator',
      desc: 'Full-length timed exam simulation with auto-grading',
      icon: Award,
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      textAccent: 'text-amber-500 dark:text-amber-400',
      actionText: 'Start Test'
    },
    {
      id: 'practice',
      title: 'Answer Mastery Arena',
      desc: 'Practice 2/5/10 mark answers with examiner feedback',
      icon: FileCheck2,
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      textAccent: 'text-emerald-500 dark:text-emerald-400',
      actionText: 'Practice Answers'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Command Hub */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-br from-white via-slate-50/50 to-slate-100/50 dark:from-slate-900/90 dark:via-slate-950/95 dark:to-indigo-950/30 p-6 sm:p-10 shadow-xl dark:shadow-2xl backdrop-blur-2xl"
      >
        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>AI-Driven Academic Exam Operating System</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Accelerate your exam mastery with{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Nexa AI
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              Upload textbook chapters or syllabi to instantly generate structured analytical notes, active recall flashcards, and step-by-step evaluated mock exams.
            </p>
          </div>

          {/* Search / AI Query Input */}
          <form onSubmit={handleSearch} className="relative flex items-center max-w-xl">
            <div className="relative w-full flex items-center rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800/90 px-4 py-2.5 shadow-sm hover:border-emerald-500/50 focus-within:border-emerald-500 transition-all">
              <Search className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Ask Nexa any engineering concept, formula, or topic..."
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer shrink-0"
              >
                <span>Ask AI</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </form>

          {/* Metrics Overview Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Streak: <strong className="text-slate-900 dark:text-white">{user?.streakCount || 7} Days</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-cyan-500" />
              <span>Studied: <strong className="text-slate-900 dark:text-white">{user?.studyMinutes || 140} mins</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>Readiness: <strong className="text-slate-900 dark:text-white">{targetExam.readiness}%</strong></span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4 Core Pillars Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase tracking-wider">
            Exam Preparation Suite
          </h2>
          <span className="text-xs text-slate-400">4 Integrated Workspaces</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studyPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                onClick={() => setActiveTab(p.id)}
                className={`group relative flex flex-col justify-between rounded-2xl border ${p.border} bg-gradient-to-b ${p.color} dark:bg-slate-900/60 p-5 backdrop-blur-xl shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-white/10 shadow-sm">
                      <Icon className={`h-5 w-5 ${p.textAccent}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs font-semibold">
                  <span className={p.textAccent}>{p.actionText}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quick Launchpad & Study Tools */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Exam Center Blueprint Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Syllabus Blueprint & Target Exams
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('exam_center')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Map</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {targetExam.title}
                </h4>
                <p className="text-[11px] text-slate-500">Board Weightage: 100 Marks • 5 Core Units</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenEmergencyModal && onOpenEmergencyModal()}
                  className="rounded-lg bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                >
                  24H Emergency
                </button>
                <button
                  onClick={() => setActiveTab('exam_center')}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-3 py-1 text-[11px] font-bold text-white shadow-sm transition-all cursor-pointer"
                >
                  Open Blueprint
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Study Focus Timer Card */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-6 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Focus Session Clock
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pomodoro focus timer designed for active recall intervals and deep learning sprints.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('focus')}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Launch Timer</span>
          </button>
        </div>
      </section>
    </div>
  );
}
