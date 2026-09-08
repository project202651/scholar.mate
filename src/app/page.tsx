'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  FileCheck2,
  Zap,
  Bot,
  Flame,
  ShieldCheck,
  TrendingUp,
  FileText,
  Play,
  Check,
  ChevronRight,
  Star,
  Users,
  Target,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from '@/components/ThreeBackground';
import InteractiveStudyScene from '@/components/InteractiveStudyScene';

export default function LandingPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeDemoTab, setActiveDemoTab] = useState<'answer' | 'plan' | 'rubric'>('answer');

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('scholarmate_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'light') {
        root.classList.remove('dark');
        root.classList.add('light');
      } else {
        root.classList.remove('light');
        root.classList.add('dark');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('scholarmate_theme', next);
    } catch (e) {}
  };

  return (
    <div className={`relative min-h-screen font-sans antialiased selection:bg-[#54d6c7] selection:text-slate-950 ${
      theme === 'dark' ? 'bg-[#0b1220] text-[#f5f7fb]' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      {/* 3D WebGL Particle Field */}
      <ThreeBackground theme={theme} />

      {/* Marketing Header Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#54d6c7] to-[#8b5cf6] text-slate-950 shadow-lg shadow-[#54d6c7]/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">ScholarMate</span>
                <span className="rounded-full bg-[#54d6c7]/15 px-2 py-0.5 text-[10px] font-bold text-[#54d6c7] border border-[#54d6c7]/30">
                  AI
                </span>
              </div>
              <span className="block text-[10px] text-slate-400 font-medium">Smart Exam Preparation Platform</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-[#54d6c7] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#54d6c7] transition-colors">Features</a>
            <a href="#example-dashboard" className="hover:text-[#54d6c7] transition-colors">Example Dashboard</a>
            <a href="#about" className="hover:text-[#54d6c7] transition-colors">College Project</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* 3D Motion Toggle Button */}
            <button
              onClick={() => {
                try {
                  const current = localStorage.getItem('scholarmate_disable_3d') === 'true';
                  localStorage.setItem('scholarmate_disable_3d', String(!current));
                  window.location.reload();
                } catch (e) {}
              }}
              title="Toggle 3D Motion"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#54d6c7]" />
              <span>3D FX</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-[#54d6c7]" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            <Link
              href="/login"
              className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold px-4 py-2 text-xs transition-all"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-4 sm:px-5 py-2 text-xs shadow-lg shadow-[#54d6c7]/20 transition-all"
            >
              <span>Create My Study Plan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-12 pb-12 sm:px-6 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Messaging & Dominant CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#54d6c7]/30 bg-[#54d6c7]/10 px-3.5 py-1 text-xs font-bold text-[#54d6c7]">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>AI-Powered Exam Success System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Turn your syllabus into a{' '}
              <span className="bg-gradient-to-r from-[#54d6c7] via-[#70d6a8] to-[#8b5cf6] bg-clip-text text-transparent">
                study plan that gets you exam-ready.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Upload your notes and past papers. ScholarMate teaches difficult topics, creates exam-ready answers, and tracks your preparation automatically.
            </p>

            {/* Dominant Primary CTA + Clean Secondary Action */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signup"
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-8 py-4 text-xs sm:text-sm shadow-xl shadow-[#54d6c7]/25 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create My Study Plan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/app?demo=true"
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-7 py-4 text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 text-[#54d6c7]" />
                <span>Try a Demo</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#54d6c7]" />
                <span>3-Mark, 7-Mark &amp; 10-Mark Rubrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#70d6a8]" />
                <span>Active Recall Spaced Repetition</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#8b5cf6]" />
                <span>Instant Diagnostic Scoring</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Study Scene */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <InteractiveStudyScene />
          </div>
        </div>
      </section>

      {/* BRANDING CLARIFICATION BANNER */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="rounded-3xl border border-[#54d6c7]/25 bg-gradient-to-r from-[#54d6c7]/10 via-[#111c2e] to-[#8b5cf6]/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg shadow-black/30">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#54d6c7]/15 text-[#54d6c7] border border-[#54d6c7]/30 shadow-inner">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                <span className="text-[#54d6c7]">ScholarMate</span> is your exam preparation workspace. <span className="text-[#a78bfa]">Nexa</span> is the AI tutor inside ScholarMate.
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 pt-0.5">
                One unified platform for syllabus intelligence, structured active recall, and instant AI examiner diagnostics.
              </p>
            </div>
          </div>
          <Link
            href="/signup"
            className="shrink-0 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-xs font-bold text-[#54d6c7] hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3-Step Roadmap) */}
      <section id="how-it-works" className="relative z-10 border-y border-white/5 bg-[#0b1220]/60 py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#54d6c7]">Simple 3-Step Process</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              From Raw Syllabus to Top Exam Marks in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Stop guessing what to study. ScholarMate structures your revision timeline automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/80 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#54d6c7]/15 text-[#54d6c7] font-black text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Upload Your Syllabus &amp; Notes</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provide your subject list, lecture slides, or past question papers. ScholarMate maps out all units and high-weightage topics.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/80 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8b5cf6]/15 text-[#8b5cf6] font-black text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Nexa AI Teaches Difficult Concepts</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive plain-English conceptual analogies, step-by-step mathematical proofs, ASCII architecture diagrams, and examiner tips.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/80 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#70d6a8]/15 text-[#70d6a8] font-black text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Practice 3M, 7M &amp; 10M Questions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drill authentic university exam questions, submit your written answers, and receive instant rubric breakdown and scoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXAMPLE DASHBOARD (Clearly Labeled Demo Preview) */}
      <section id="example-dashboard" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live Interactive Demo Preview</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Example Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Here is what a student workspace looks like once a study plan is generated. You can test the interactive tabs below.
              </p>
            </div>

            <Link
              href="/app?demo=true"
              className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-bold px-5 py-2.5 text-xs shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer shrink-0"
            >
              <span>Launch Full App Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Example Dashboard Frame */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#111c2e] via-[#0b1220] to-[#17253a] p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Top Bar Preview */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#54d6c7]">Example Student Track</span>
                <h3 className="text-lg font-black text-white">Operating Systems &amp; System Software (6th Sem)</h3>
                <span className="text-xs text-slate-400">Exam Date: Oct 15, 2026 • 18 Days Remaining • Target Score: 90%</span>
              </div>

              {/* Demo Mode Tabs */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-white/10">
                <button
                  onClick={() => setActiveDemoTab('answer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDemoTab === 'answer' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Exam Answer Drill
                </button>
                <button
                  onClick={() => setActiveDemoTab('plan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDemoTab === 'plan' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Actionable Tasks
                </button>
                <button
                  onClick={() => setActiveDemoTab('rubric')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDemoTab === 'rubric' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Marking Rubric
                </button>
              </div>
            </div>

            {/* Tab 1: Exam Answer Drill */}
            {activeDemoTab === 'answer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#54d6c7]/20 text-[#54d6c7] border border-[#54d6c7]/30">
                      7-Mark Question Drill
                    </span>
                    <span className="text-xs text-slate-400">Unit 2: Deadlocks</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">100% University Exam Match</span>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-[#0b1220] space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-white">
                    Q: Explain the 4 necessary conditions for Deadlock occurrence and demonstrate Banker&apos;s algorithm safety verification.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl border border-white/5 bg-slate-900/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#54d6c7]">1. Plain Intuition</span>
                      <p className="text-slate-300 text-[11px]">Two cars facing each other on a narrow one-lane bridge: neither can reverse!</p>
                    </div>
                    <div className="p-3 rounded-xl border border-white/5 bg-slate-900/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#70d6a8]">2. 4 Conditions</span>
                      <p className="text-slate-300 text-[11px]">Mutual Exclusion, Hold &amp; Wait, No Preemption, Circular Wait.</p>
                    </div>
                    <div className="p-3 rounded-xl border border-white/5 bg-slate-900/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#8b5cf6]">3. Examiner Tip</span>
                      <p className="text-slate-300 text-[11px]">Always write the Need Matrix formula: Need[i][j] = Max[i][j] - Alloc[i][j].</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Actionable Tasks */}
            {activeDemoTab === 'plan' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Today&apos;s Actionable Schedule (Example)</span>
                  <span className="text-[#54d6c7] font-mono font-bold">3/4 Completed (75%)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Start 15-Minute Banker&apos;s Drill</span>
                      <span className="text-[10px] text-slate-400">10-Mark Core Derivation</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                      Completed
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Review 12 Cards: Paging &amp; TLB</span>
                      <span className="text-[10px] text-slate-400">Active Recall</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300">
                      In Progress
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Marking Rubric */}
            {activeDemoTab === 'rubric' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-white/10 bg-[#0b1220] space-y-2 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#54d6c7]" />
                    <span>Official 10-Mark University Rubric Breakdown</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                    <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/60">
                      <span className="text-[#54d6c7] font-bold block">Axioms &amp; Defs (2M)</span>
                      <span className="text-slate-400">Full marks for precise standard definitions</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/60">
                      <span className="text-[#70d6a8] font-bold block">Architecture (3M)</span>
                      <span className="text-slate-400">Labeled block diagram with signal flow</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/60">
                      <span className="text-[#8b5cf6] font-bold block">Derivation (3M)</span>
                      <span className="text-slate-400">Step-by-step mathematical sequence</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/60">
                      <span className="text-cyan-400 font-bold block">Applications (2M)</span>
                      <span className="text-slate-400">Real-world engineering use cases</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES BREAKDOWN */}
      <section id="features" className="relative z-10 border-t border-white/5 bg-[#0b1220]/70 py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#54d6c7]">Built For Engineering Students</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Everything You Need to Pass with Distinction
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Integrated study coaching that turns weeks of stress into organized, confident preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/80 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#54d6c7]/15 text-[#54d6c7]">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Nexa AI Concept Coach</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Break down complex algorithms and derivations with 8-step pedagogical lessons, analogies, and examiner trap alerts.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/80 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#70d6a8]/15 text-[#70d6a8]">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">3M, 7M &amp; 10M Question Banks</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate 15 to 20 exam-exact questions per topic with full model answers, ASCII schematics, and rubric criteria.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/80 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8b5cf6]/15 text-[#8b5cf6]">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Timed Mock Exam Simulator</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Simulate real board and university test environments with automatic timekeeping and comprehensive post-exam reports.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/80 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#6ea8fe]/15 text-[#6ea8fe]">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Spaced Flashcards &amp; Active Recall</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consolidate definitions, formulas, and diagrams using automated spaced intervals so you never blank out in the exam.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/80 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6c85f]/15 text-[#f6c85f]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Notes &amp; Summaries</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Auto-extract 10-section deep analytical summaries, bullet cheat sheets, and high-frequency question patterns from your notes.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/80 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
                <Flame className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Weakness Diagnostic Engine</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Detect your lowest-scoring topics and schedule immediate targeted repair sessions before exam day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-20 sm:px-6 text-center">
        <div className="rounded-3xl border border-[#54d6c7]/30 bg-gradient-to-br from-[#17253a] via-[#111c2e] to-[#0b1220] p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-4 py-1 text-xs font-bold text-[#54d6c7]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ready in under 1 minute</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Start Your Personalized Exam Preparation Today
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Input your subjects, set your target grade, and let ScholarMate generate your personalized day-by-day path to exam readiness.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/signup"
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-8 py-4 text-xs sm:text-sm shadow-xl shadow-[#54d6c7]/25 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create My Study Plan</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-7 py-4 text-xs sm:text-sm transition-all cursor-pointer"
            >
              Student Portal Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FOOTER & ACADEMIC PROJECT ATTRIBUTION */}
      <footer id="about" className="relative z-10 border-t border-white/5 bg-[#0b1220]/90 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <GraduationCap className="h-5 w-5 text-[#54d6c7]" />
              <span className="text-sm font-extrabold text-white">ScholarMate</span>
            </div>
            <p className="text-xs text-slate-400">
              Department of Artificial Intelligence &amp; Machine Learning (2026-2027)
            </p>
            <p className="text-xs text-slate-400">
              AANM &amp; VVRSR Polytechnic College
            </p>
          </div>

          <div className="text-center sm:text-right text-xs text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">Project Development Team:</p>
            <p>Vastav • Vishnu • Nikhileswar • Sathvik</p>
            <p className="text-[10px] text-slate-500 pt-1">© 2026 ScholarMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
