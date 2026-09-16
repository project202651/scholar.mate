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
  Bot,
  Flame,
  FileText,
  Play,
  Check,
  ChevronRight,
  Award,
  Calendar,
  Sun,
  Moon,
  Menu,
  X,
  Target,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from '@/components/ThreeBackground';
import InteractiveStudyScene from '@/components/InteractiveStudyScene';

export default function LandingPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeDemoTab, setActiveDemoTab] = useState<'answer' | 'plan' | 'rubric'>('answer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* 3D WebGL Particle Field (Ambient & Unlabeled) */}
      <ThreeBackground theme={theme} />

      {/* Persistent Capstone Attribution Top Bar (Requirement 5) */}
      <aside aria-label="Project Attribution" className="relative z-50 border-b border-white/10 bg-[#0e1726] px-4 py-2 text-center text-xs font-semibold text-slate-200">
        <div className="mx-auto max-w-7xl flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="text-emerald-400 font-bold">AIML Dept. Capstone Project</span>
          <span className="text-slate-500">—</span>
          <span>AANM &amp; VVRSR Polytechnic</span>
        </div>
      </aside>

      {/* Marketing Header Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-xl px-4 sm:px-6 py-3.5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#54d6c7] to-[#8b5cf6] text-slate-950 shadow-lg shadow-[#54d6c7]/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">ScholarMate</span>
                <span className="rounded-full bg-[#54d6c7]/15 px-2 py-0.5 text-[11px] font-bold text-[#54d6c7] border border-[#54d6c7]/30">
                  AIML
                </span>
              </div>
              <span className="block text-xs text-slate-300 font-medium">Exam Preparation Platform</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-[#54d6c7] transition-colors">How It Works</a>
            <a href="#example-dashboard" className="hover:text-[#54d6c7] transition-colors">Interactive Demo</a>
            <a href="#outputs" className="hover:text-[#54d6c7] transition-colors">Real Outputs</a>
            <a href="#features" className="hover:text-[#54d6c7] transition-colors">Features</a>
            <Link href="/plan" className="hover:text-[#54d6c7] transition-colors">Study Plan</Link>
          </nav>

          {/* Header Actions: Plain Sign In Link + Consistent Primary CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-[#54d6c7]" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            {/* Plain Nav Link for Sign In (Requirement 1) */}
            <Link
              href="/login"
              className="hidden sm:inline-block text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>

            {/* Primary CTA (Requirement 1) */}
            <Link
              href="/signup"
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-4 sm:px-5 py-2.5 text-xs shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
            >
              <span>Create My Study Plan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-[#54d6c7]" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 mt-3 pt-3 pb-2 space-y-2"
            >
              <a
                href="#how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5"
              >
                How It Works
              </a>
              <a
                href="#example-dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5"
              >
                Interactive Demo
              </a>
              <a
                href="#outputs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5"
              >
                Real Outputs
              </a>
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5"
              >
                Features
              </a>
              <Link
                href="/plan"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#54d6c7] hover:bg-[#54d6c7]/10"
              >
                Study Plan &amp; Roadmap
              </Link>
              <div className="pt-2 border-t border-white/5 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white"
                >
                  Sign In
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/app?demo=true"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl border border-white/15 bg-white/5 text-white font-bold text-xs"
                  >
                    Try the Demo
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center py-2.5 rounded-xl bg-[#54d6c7] text-slate-950 font-black text-xs shadow-md shadow-[#54d6c7]/20"
                  >
                    Create My Study Plan
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 1. HERO SECTION (Concise, concrete copy - Requirement 2) */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 lg:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Messaging & Exactly 2 CTAs */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#54d6c7]/30 bg-[#54d6c7]/10 px-3.5 py-1 text-xs font-bold text-[#54d6c7]">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Calibrated for Indian University Exams</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Turn your syllabus into{' '}
              <span className="bg-gradient-to-r from-[#54d6c7] via-[#70d6a8] to-[#8b5cf6] bg-clip-text text-transparent">
                exam-ready answers.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              Upload notes or past question papers. Get step-by-step mathematical derivations, official 3M/7M/10M marking rubrics, and a day-by-day revision schedule.
            </p>

            {/* Exactly Two Consistent CTAs (Requirement 1) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signup"
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-8 py-3.5 text-xs sm:text-sm shadow-xl shadow-[#54d6c7]/25 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>Create My Study Plan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/app?demo=true"
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-7 py-3.5 text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 text-[#54d6c7]" />
                <span>Try the Demo</span>
              </Link>
            </div>

            {/* Concrete Proof Metrics (WCAG AA Compliant contrast) */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#54d6c7]" />
                <span>3M, 7M &amp; 10M Exact Rubrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#70d6a8]" />
                <span>Active Recall Spaced Repetition</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#8b5cf6]" />
                <span>Step-by-Step Proof Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Ambient Visual Scene */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <InteractiveStudyScene />
          </div>
        </div>
      </section>

      {/* BRANDING CLARIFICATION BANNER (Consistent CTA) */}
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
              <p className="text-xs text-slate-300 pt-0.5">
                One platform for syllabus intelligence, structured active recall, and instant AI examiner diagnostics.
              </p>
            </div>
          </div>
          <Link
            href="/app?demo=true"
            className="shrink-0 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-xs font-bold text-[#54d6c7] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Try the Demo</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 2. HOW IT WORKS (Concise 3-Step Process - Requirement 2) */}
      <section id="how-it-works" className="relative z-10 border-y border-white/5 bg-[#0b1220]/60 py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#54d6c7]">How It Works</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              From Raw Syllabus to Exam Day in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Clear revision structured around your university course plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/90 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#54d6c7]/15 text-[#54d6c7] font-black text-base">
                1
              </div>
              <h3 className="text-base font-bold text-white">Upload Notes &amp; Past Papers</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provide lecture slides or question papers. ScholarMate indexes high-weightage topics and recurring questions across all 5 units.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/90 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8b5cf6]/15 text-[#8b5cf6] font-black text-base">
                2
              </div>
              <h3 className="text-base font-bold text-white">Master Step-by-Step Proofs</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nexa AI breaks down derivations with plain analogies, responsive architecture diagrams, and examiner mark traps.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-white/10 bg-[#111c2e]/90 space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#70d6a8]/15 text-[#70d6a8] font-black text-base">
                3
              </div>
              <h3 className="text-base font-bold text-white">Drill 3M, 7M &amp; 10M Questions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Answer authentic university questions and get instant criteria-based scoring with exact marks allocated per step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE DEMO (Consistent "Try the Demo" CTA - Requirement 1) */}
      <section id="example-dashboard" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live Interactive Demo Preview</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Interactive Student Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Test the interactive tabs below to see how a calibrated study track guides daily revision.
              </p>
            </div>

            {/* Consistent Secondary CTA (Requirement 1) */}
            <Link
              href="/app?demo=true"
              className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-bold px-5 py-2.5 text-xs shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer shrink-0"
            >
              <span>Try the Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Example Dashboard Frame */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#111c2e] via-[#0b1220] to-[#17253a] p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Top Bar Preview */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#54d6c7]">Example Student Track</span>
                <h3 className="text-lg font-black text-white">Operating Systems &amp; System Software (6th Sem)</h3>
                <span className="text-xs text-slate-300">Exam Date: Oct 15, 2026 • 18 Days Remaining • Target Score: 90%</span>
              </div>

              {/* Demo Mode Tabs with ARIA Accessibility */}
              <div role="tablist" aria-label="Interactive Preview Tabs" className="flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-white/10">
                <button
                  role="tab"
                  aria-selected={activeDemoTab === 'answer'}
                  onClick={() => setActiveDemoTab('answer')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDemoTab === 'answer' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Exam Answer Drill
                </button>
                <button
                  role="tab"
                  aria-selected={activeDemoTab === 'plan'}
                  onClick={() => setActiveDemoTab('plan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDemoTab === 'plan' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Actionable Tasks
                </button>
                <button
                  role="tab"
                  aria-selected={activeDemoTab === 'rubric'}
                  onClick={() => setActiveDemoTab('rubric')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDemoTab === 'rubric' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-300 hover:text-white'
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
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#54d6c7]/20 text-[#54d6c7] border border-[#54d6c7]/30">
                      7-Mark Question Drill
                    </span>
                    <span className="text-xs text-slate-300">Unit 2: Deadlocks</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">100% University Exam Match</span>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-[#0b1220] space-y-3">
                  <p className="text-xs sm:text-sm font-bold text-white">
                    Q: Explain the 4 necessary conditions for Deadlock occurrence and demonstrate Banker&apos;s algorithm safety verification.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl border border-white/5 bg-slate-900/80 space-y-1">
                      <span className="text-xs uppercase font-bold text-[#54d6c7]">1. Plain Intuition</span>
                      <p className="text-slate-200 text-xs">Two cars on a narrow one-lane bridge: neither can proceed or reverse without yielding!</p>
                    </div>
                    <div className="p-3 rounded-xl border border-white/5 bg-slate-900/80 space-y-1">
                      <span className="text-xs uppercase font-bold text-[#70d6a8]">2. 4 Conditions</span>
                      <p className="text-slate-200 text-xs">Mutual Exclusion, Hold &amp; Wait, No Preemption, and Circular Wait.</p>
                    </div>
                    <div className="p-3 rounded-xl border border-white/5 bg-slate-900/80 space-y-1">
                      <span className="text-xs uppercase font-bold text-[#a78bfa]">3. Examiner Tip</span>
                      <p className="text-slate-200 text-xs">Always state: Need[i][j] = Max[i][j] - Allocation[i][j] before matrix reduction.</p>
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
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Start 15-Minute Banker&apos;s Drill</span>
                      <span className="text-xs text-slate-300">10-Mark Core Derivation</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                      Completed
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Review 12 Cards: Paging &amp; TLB</span>
                      <span className="text-xs text-slate-300">Active Recall</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300">
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
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/60">
                      <span className="text-[#54d6c7] font-bold block">Axioms &amp; Defs (2M)</span>
                      <span className="text-slate-300">Precise 4-condition definitions</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/60">
                      <span className="text-[#70d6a8] font-bold block">Architecture (3M)</span>
                      <span className="text-slate-300">Labeled resource allocation graph</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/60">
                      <span className="text-[#a78bfa] font-bold block">Derivation (3M)</span>
                      <span className="text-slate-300">Need matrix safety verification</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-white/5 bg-slate-900/60">
                      <span className="text-cyan-400 font-bold block">Applications (2M)</span>
                      <span className="text-slate-300">Multi-threaded deadlock avoidance</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. REAL OUTPUTS SHOWCASE (Requirement 7: Trust-builder before asking for signup) */}
      <section id="outputs" className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#54d6c7]">Tangible Proof</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Real Outputs Generated by ScholarMate
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Exam-accurate cards and step-by-step scoring generated directly from syllabus input.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Output Card 1: Active Recall Flashcard */}
            <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#54d6c7]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Active Recall Flashcard</span>
                </div>
                <span className="text-xs text-[#54d6c7] font-semibold bg-[#54d6c7]/15 px-2.5 py-0.5 rounded-full border border-[#54d6c7]/30">
                  Spaced Repetition #4
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-1">
                  <span className="text-xs font-bold text-[#8b5cf6] uppercase">Prompt:</span>
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    State the Effective Access Time (EAT) formula for Paging with a Translation Lookaside Buffer (TLB).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-[#54d6c7]/30 space-y-2">
                  <span className="text-xs font-bold text-[#54d6c7] uppercase">Model Answer / Reverse:</span>
                  <div className="font-mono text-xs text-white bg-slate-900/90 p-2.5 rounded-lg overflow-x-auto border border-white/10">
                    EAT = α · (t_TLB + t_RAM) + (1 - α) · (t_TLB + 2 · t_RAM)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Where <strong>α</strong> = TLB Hit Ratio. On a miss, two memory accesses are required: one for the page table, one for the data.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-300">
                  <span className="italic text-emerald-400">Next interval: 3 days</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono text-[11px]">Again</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono text-[11px]">Hard</span>
                    <span className="px-2 py-0.5 rounded bg-[#54d6c7]/20 text-[#54d6c7] font-mono text-[11px] font-bold">Good</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Card 2: Diagnostic Rubric Grading Breakdown */}
            <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-[#70d6a8]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Diagnostic Examiner Scoring</span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Scored: 6.5 / 7.0 Marks (93%)
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-200 font-medium">
                  <strong>Question:</strong> Differentiate between 3NF and BCNF with a comparative table and counter-example schema.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">1. Comparative Matrix (4 Parameters)</span>
                      <p className="text-xs text-slate-300">Determinant constraints, redundancy, and dependency preservation.</p>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">+2.5 / 2.5M</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">2. Concrete Schema Counter-Example</span>
                      <p className="text-xs text-slate-300">Student used Student-Course-Instructor schema correctly.</p>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">+2.5 / 2.5M</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">3. Dependency Preservation Analysis</span>
                      <p className="text-xs text-slate-300">Minor omission: did not state why 3NF is sometimes preferred in production.</p>
                    </div>
                    <span className="text-amber-400 font-bold font-mono">+1.5 / 2.0M</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  💡 <strong>Examiner Feedback:</strong> &quot;Highlight that BCNF decomposition may not preserve functional dependencies to capture full marks.&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES: Promoted 7M/10M Rubric Drill + 5 Compact Features (Requirement 3) */}
      <section id="features" className="relative z-10 border-t border-white/5 bg-[#0b1220]/70 py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black uppercase tracking-wider text-[#54d6c7]">Exam Preparation Grounding</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Built Around University Marking Schemes
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Features engineered around how board and university examiners evaluate answers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* PROMOTED HERO FEATURE (Spans 7 Columns on LG) - Requirement 3 */}
            <div className="lg:col-span-7 rounded-3xl border border-[#54d6c7]/40 bg-gradient-to-br from-[#111c2e] via-[#0b1220] to-[#17253a] p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-3 py-1 text-xs font-bold text-[#54d6c7] border border-[#54d6c7]/30">
                  <Award className="h-3.5 w-3.5" />
                  <span>Core Flagship Feature</span>
                </div>
                <span className="text-xs text-emerald-400 font-bold font-mono">10 / 10 Marks Awarded</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Rubric-Graded 7M &amp; 10M Answer Drills
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Avoid vague AI essays. ScholarMate breaks down answers into exact university criteria: formal definitions, labeled block schematics, mathematical proof steps, and engineering use cases.
                </p>
              </div>

              {/* Real 10-Mark Rubric Walkthrough Card */}
              <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="font-bold text-white">Sample 10-Mark Rubric: Banker&apos;s Safety Algorithm</span>
                  <span className="text-[#54d6c7] font-semibold">Unit 2: Operating Systems</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-slate-200">
                    <Check className="h-4 w-4 text-[#54d6c7] shrink-0 mt-0.5" />
                    <span><strong>Axioms &amp; 4 Conditions (2M):</strong> Mutual exclusion, hold &amp; wait, no preemption, circular wait.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-200">
                    <Check className="h-4 w-4 text-[#70d6a8] shrink-0 mt-0.5" />
                    <span><strong>Architecture Schematic (3M):</strong> Resource Allocation Graph showing edge request vectors.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-200">
                    <Check className="h-4 w-4 text-[#a78bfa] shrink-0 mt-0.5" />
                    <span><strong>Derivation Sequence (3M):</strong> Need[i][j] = Max[i][j] - Allocation[i][j] safety matrix verification.</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-200">
                    <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span><strong>Real-World Application (2M):</strong> Multi-threaded lock sequencing in OS kernels.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-300 italic">Verified against board grading standards</span>
                  <Link href="/app?demo=true" className="text-xs font-bold text-[#54d6c7] hover:underline flex items-center gap-1">
                    <span>Try the Demo</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 5 COMPACT FEATURES (Spans 5 Columns on LG) - Requirement 3 */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3">
              <div className="p-4 rounded-2xl border border-white/10 bg-[#111c2e]/80 flex items-center gap-3.5 hover:border-white/20 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#54d6c7]/15 text-[#54d6c7]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Nexa AI Concept Coach</h4>
                  <p className="text-xs text-slate-300">Plain-English analogies and step-by-step proofs for difficult topics.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-[#111c2e]/80 flex items-center gap-3.5 hover:border-white/20 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8b5cf6]/15 text-[#8b5cf6]">
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Timed Mock Exam Simulator</h4>
                  <p className="text-xs text-slate-300">Simulates 3-hour university test environments with automatic timekeeping.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-[#111c2e]/80 flex items-center gap-3.5 hover:border-white/20 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#70d6a8]/15 text-[#70d6a8]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Spaced Recall Flashcards</h4>
                  <p className="text-xs text-slate-300">Automated Leitner memory intervals for definitions and key formulas.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-[#111c2e]/80 flex items-center gap-3.5 hover:border-white/20 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6c85f]/15 text-[#f6c85f]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">1-Page Morning Revision Sheets</h4>
                  <p className="text-xs text-slate-300">Ultra-dense formula cheat sheets and examiner traps formatted for 1 printed page.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-[#111c2e]/80 flex items-center gap-3.5 hover:border-white/20 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Weakness Diagnostic Engine</h4>
                  <p className="text-xs text-slate-300">Pinpoints your lowest-scoring syllabus units for targeted repair drills.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION (Exactly 2 Consistent CTAs - Requirement 1) */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 text-center">
        <div className="rounded-3xl border border-[#54d6c7]/30 bg-gradient-to-br from-[#17253a] via-[#111c2e] to-[#0b1220] p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-4 py-1 text-xs font-bold text-[#54d6c7]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ready in under 1 minute</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Start Your Exam Preparation Today
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mx-auto">
            Input your subjects, select your target grade, and let ScholarMate generate your personalized day-by-day revision schedule.
          </p>

          {/* Consistent Primary and Secondary CTAs (Requirement 1) */}
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
              href="/app?demo=true"
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-7 py-4 text-xs sm:text-sm transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 text-[#54d6c7]" />
              <span>Try the Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER & ACADEMIC PROJECT ATTRIBUTION (WCAG AA text contrast) */}
      <footer id="about" className="relative z-10 border-t border-white/5 bg-[#0b1220]/95 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <GraduationCap className="h-5 w-5 text-[#54d6c7]" />
              <span className="text-sm font-extrabold text-white">ScholarMate</span>
            </div>
            <p className="text-xs text-slate-300">
              Department of Artificial Intelligence &amp; Machine Learning (2026-2027)
            </p>
            <p className="text-xs text-slate-300">
              AANM &amp; VVRSR Polytechnic College
            </p>
          </div>

          <div className="text-center sm:text-right text-xs text-slate-300 space-y-1">
            <p className="font-bold text-white">Project Development Team:</p>
            <p>Vastav • Vishnu • Nikhileswar • Sathvik</p>
            <p className="text-xs text-slate-400 pt-1">© 2026 ScholarMate AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
