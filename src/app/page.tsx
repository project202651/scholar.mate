'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers,
  FileCheck2,
  Bot,
  Flame,
  Play,
  Check,
  ChevronRight,
  Award,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from '@/components/ThreeBackground';
import InteractiveStudyScene from '@/components/InteractiveStudyScene';

/* ─── Fade-in animation wrapper ─── */
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen font-sans antialiased selection:bg-[#54d6c7] selection:text-slate-950 bg-[#0b1220] text-[#f5f7fb]">
      {/* Ambient WebGL particle background */}
      <ThreeBackground theme="dark" />

      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-xl px-4 sm:px-6 py-3.5">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#54d6c7] to-[#8b5cf6] text-slate-950 shadow-lg shadow-[#54d6c7]/20">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
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

          {/* Desktop Nav — reduced to 3 links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-[#54d6c7] transition-colors">How It Works</a>
            <a href="#features" className="hover:text-[#54d6c7] transition-colors">Features</a>
            <Link href="/plan" className="hover:text-[#54d6c7] transition-colors">Study Plan</Link>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-block text-sm font-bold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-5 py-2.5 text-sm shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
            >
              <span>Create My Study Plan</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-[#54d6c7]" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 mt-3 pt-3 pb-2 space-y-2"
            >
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5">
                How It Works
              </a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5">
                Features
              </a>
              <Link href="/plan" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-[#54d6c7] hover:bg-[#54d6c7]/10">
                Study Plan
              </Link>
              <div className="pt-2 border-t border-white/5 space-y-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white">
                  Sign In
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/app?demo=true" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 rounded-xl border border-white/15 bg-white/5 text-white font-bold text-sm">
                    Try the Demo
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-2.5 rounded-xl bg-[#54d6c7] text-slate-950 font-black text-sm shadow-md shadow-[#54d6c7]/20">
                    Create My Study Plan
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════ SECTION 1: HERO ═══════════════════ */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Copy + CTAs */}
          <FadeIn className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#54d6c7]/30 bg-[#54d6c7]/10 px-4 py-1.5 text-sm font-bold text-[#54d6c7]">
              <Sparkles className="h-4 w-4 animate-pulse" aria-hidden="true" />
              <span>Calibrated for Indian University Exams</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Turn your syllabus into{' '}
              <span className="bg-gradient-to-r from-[#54d6c7] via-[#70d6a8] to-[#8b5cf6] bg-clip-text text-transparent">
                exam-ready answers.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
              Upload notes or past papers. Get step-by-step derivations, official 3M/7M/10M marking rubrics, and a day-by-day revision schedule — all in one workspace.
            </p>

            {/* Two CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/signup"
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-8 py-4 text-sm shadow-xl shadow-[#54d6c7]/25 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <span>Create My Study Plan</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/app?demo=true"
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-7 py-4 text-sm transition-all cursor-pointer"
              >
                <Play className="h-4 w-4 text-[#54d6c7]" aria-hidden="true" />
                <span>Try the Demo</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#54d6c7]" aria-hidden="true" />
                <span>3M, 7M &amp; 10M Rubrics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#70d6a8]" aria-hidden="true" />
                <span>Active Recall</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#8b5cf6]" aria-hidden="true" />
                <span>Step-by-Step Proofs</span>
              </div>
            </div>
          </FadeIn>

          {/* Right: 3D Immersive Study Scene */}
          <FadeIn delay={0.2} className="lg:col-span-5 flex items-center justify-center">
            <div className="relative">
              {/* Ambient glow behind 3D scene */}
              <div className="absolute inset-0 -m-8 rounded-full bg-gradient-to-br from-[#54d6c7]/20 via-transparent to-[#8b5cf6]/20 blur-3xl pointer-events-none" />
              <InteractiveStudyScene />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════ SECTION 2: HOW IT WORKS ═══════════════════ */}
      <section id="how-it-works" className="relative z-10 border-y border-white/5 bg-[#0b1220]/60 py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <FadeIn className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-sm font-black uppercase tracking-wider text-[#54d6c7]">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              From Raw Syllabus to Exam Day in 3 Steps
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Clear revision structured around your university course plan.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '1',
                color: '#54d6c7',
                title: 'Upload Notes & Past Papers',
                desc: 'Provide lecture slides or question papers. ScholarMate indexes high-weightage topics across all 5 units.',
              },
              {
                num: '2',
                color: '#8b5cf6',
                title: 'Master Step-by-Step Proofs',
                desc: 'Nexa AI breaks down derivations with plain analogies, architecture diagrams, and examiner mark traps.',
              },
              {
                num: '3',
                color: '#70d6a8',
                title: 'Drill 3M, 7M & 10M Questions',
                desc: 'Answer authentic university questions and get instant criteria-based scoring with exact marks per step.',
              },
            ].map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1}>
                <div className="p-7 rounded-3xl border border-white/10 bg-[#111c2e]/90 space-y-4 h-full hover:border-white/20 transition-all">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl font-black text-lg"
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 3: BENTO FEATURE GRID ═══════════════════ */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl space-y-12">
          <FadeIn className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-sm font-black uppercase tracking-wider text-[#54d6c7]">Exam Preparation Grounding</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Built Around University Marking Schemes
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Every feature is engineered around how university examiners evaluate answers.
            </p>
          </FadeIn>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* ── LARGE PROMOTED CARD: 7M/10M Rubric Drill (spans 2 cols) ── */}
            <FadeIn className="md:col-span-2 lg:col-span-2">
              <div className="rounded-3xl border border-[#54d6c7]/30 bg-gradient-to-br from-[#111c2e] via-[#0b1220] to-[#17253a] p-7 sm:p-8 shadow-2xl space-y-5 h-full relative overflow-hidden">
                {/* Ambient corner glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#54d6c7]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-3.5 py-1.5 text-sm font-bold text-[#54d6c7] border border-[#54d6c7]/30">
                      <Award className="h-4 w-4" aria-hidden="true" />
                      <span>Core Feature</span>
                    </div>
                    <span className="text-sm text-emerald-400 font-bold font-mono">10 / 10 Marks</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      Rubric-Graded 7M &amp; 10M Answer Drills
                    </h3>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                      No vague AI essays. ScholarMate breaks answers into exact university criteria: formal definitions, labeled schematics, mathematical proof steps, and engineering use cases.
                    </p>
                  </div>

                  {/* Live rubric example */}
                  <div className="rounded-2xl border border-white/10 bg-[#0b1220]/90 p-5 space-y-3">
                    <div className="flex items-center justify-between text-sm border-b border-white/10 pb-2.5">
                      <span className="font-bold text-white">Sample: Banker&apos;s Safety Algorithm</span>
                      <span className="text-[#54d6c7] font-semibold">Unit 2 · OS</span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Axioms & 4 Conditions', marks: '2M', color: '#54d6c7', desc: 'Mutual exclusion, hold & wait, no preemption, circular wait.' },
                        { label: 'Architecture Schematic', marks: '3M', color: '#70d6a8', desc: 'Resource Allocation Graph with edge request vectors.' },
                        { label: 'Derivation Sequence', marks: '3M', color: '#a78bfa', desc: 'Need[i][j] = Max[i][j] - Allocation[i][j] safety verification.' },
                        { label: 'Real-World Application', marks: '2M', color: '#6ea8fe', desc: 'Multi-threaded lock sequencing in OS kernels.' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-2.5 text-sm text-slate-200">
                          <Check className="h-4 w-4 shrink-0 mt-0.5" style={{ color: item.color }} aria-hidden="true" />
                          <span>
                            <strong>{item.label} ({item.marks}):</strong> {item.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-sm">
                      <span className="text-slate-300 italic">Verified against board grading standards</span>
                      <Link href="/app?demo=true" className="font-bold text-[#54d6c7] hover:underline flex items-center gap-1">
                        <span>Try it</span>
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* ── COMPACT CARD: Nexa AI Concept Coach ── */}
            <FadeIn delay={0.1}>
              <div className="rounded-3xl border border-white/10 bg-[#111c2e]/80 p-6 space-y-4 h-full hover:border-[#54d6c7]/30 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#54d6c7]/15 text-[#54d6c7] group-hover:scale-110 transition-transform">
                  <Bot className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-white">Nexa AI Concept Coach</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Plain-English analogies, step-by-step proofs, and examiner-perspective tips for difficult topics. Ask Nexa anything about your syllabus.
                </p>
              </div>
            </FadeIn>

            {/* ── COMPACT CARD: Mock Exam Simulator ── */}
            <FadeIn delay={0.15}>
              <div className="rounded-3xl border border-white/10 bg-[#111c2e]/80 p-6 space-y-4 h-full hover:border-[#8b5cf6]/30 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8b5cf6]/15 text-[#8b5cf6] group-hover:scale-110 transition-transform">
                  <FileCheck2 className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-white">Timed Mock Exams</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Simulate 3-hour university test environments with automatic timekeeping and instant criteria-based scoring.
                </p>
              </div>
            </FadeIn>

            {/* ── COMPACT CARD: Spaced Recall Flashcards ── */}
            <FadeIn delay={0.2}>
              <div className="rounded-3xl border border-white/10 bg-[#111c2e]/80 p-6 space-y-4 h-full hover:border-[#70d6a8]/30 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#70d6a8]/15 text-[#70d6a8] group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-white">Spaced Recall Flashcards</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Automated Leitner memory intervals for definitions and key formulas. Never forget what you studied.
                </p>
              </div>
            </FadeIn>

            {/* ── COMPACT CARD: Revision Sheets ── */}
            <FadeIn delay={0.25}>
              <div className="rounded-3xl border border-white/10 bg-[#111c2e]/80 p-6 space-y-4 h-full hover:border-[#f6c85f]/30 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f6c85f]/15 text-[#f6c85f] group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-white">1-Page Revision Sheets</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Ultra-dense formula cheat sheets and examiner traps formatted for quick morning revision.
                </p>
              </div>
            </FadeIn>

            {/* ── COMPACT CARD: Weakness Diagnostic ── */}
            <FadeIn delay={0.3}>
              <div className="rounded-3xl border border-white/10 bg-[#111c2e]/80 p-6 space-y-4 h-full hover:border-rose-500/30 transition-all group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 group-hover:scale-110 transition-transform">
                  <Flame className="h-6 w-6" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-white">Weakness Diagnostic</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Pinpoints your lowest-scoring syllabus units and generates targeted repair drills to close gaps.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 4: FINAL CTA ═══════════════════ */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-20 sm:px-6 text-center">
        <FadeIn>
          <div className="rounded-3xl border border-[#54d6c7]/30 bg-gradient-to-br from-[#17253a] via-[#111c2e] to-[#0b1220] p-10 sm:p-14 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#54d6c7]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#54d6c7]/15 px-4 py-1.5 text-sm font-bold text-[#54d6c7]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Ready in under 1 minute</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Start Your Exam Preparation Today
              </h2>

              <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto">
                Input your subjects, select your target grade, and get a personalized day-by-day revision schedule.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/signup"
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-8 py-4 text-sm shadow-xl shadow-[#54d6c7]/25 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  <span>Create My Study Plan</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/app?demo=true"
                  className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-7 py-4 text-sm transition-all cursor-pointer"
                >
                  <Play className="h-4 w-4 text-[#54d6c7]" aria-hidden="true" />
                  <span>Try the Demo</span>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer id="about" className="relative z-10 border-t border-white/5 bg-[#0b1220]/95 py-12 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <GraduationCap className="h-5 w-5 text-[#54d6c7]" aria-hidden="true" />
              <span className="text-sm font-extrabold text-white">ScholarMate</span>
            </div>
            <p className="text-sm text-slate-300">Department of Artificial Intelligence &amp; Machine Learning (2026-2027)</p>
            <p className="text-sm text-slate-300">AANM &amp; VVRSR Polytechnic College</p>
          </div>
          <div className="text-center sm:text-right text-sm text-slate-300 space-y-1">
            <p className="font-bold text-white">Project Development Team:</p>
            <p>Vastav • Vishnu • Nikhileswar • Sathvik</p>
            <p className="text-slate-400 pt-1">© 2026 ScholarMate AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
