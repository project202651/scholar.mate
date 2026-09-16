'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  Calendar,
  Home,
  Bot
} from 'lucide-react';
import ThreeBackground from '@/components/ThreeBackground';

export default function NotFound() {
  return (
    <div className="relative min-h-screen font-sans antialiased bg-[#0b1220] text-[#f5f7fb] flex flex-col justify-between selection:bg-[#54d6c7] selection:text-slate-950">
      <ThreeBackground theme="dark" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#54d6c7] to-[#8b5cf6] text-slate-950 shadow-lg shadow-[#54d6c7]/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">ScholarMate</span>
                <span className="rounded-full bg-[#54d6c7]/15 px-2 py-0.5 text-[10px] font-bold text-[#54d6c7] border border-[#54d6c7]/30">
                  AI
                </span>
              </div>
              <span className="block text-[10px] text-slate-400 font-medium">Exam Preparation System</span>
            </div>
          </Link>

          <Link
            href="/app"
            className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-xs font-bold text-[#54d6c7] hover:text-white transition-all"
          >
            <span>Launch App</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* 404 Hero Recovery Content */}
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 text-center space-y-8 my-auto">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-bold text-rose-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Error 404 • Resource Not Found</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Lost Your <span className="bg-gradient-to-r from-[#54d6c7] via-[#70d6a8] to-[#8b5cf6] bg-clip-text text-transparent">Study Track?</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            The page or topic you are looking for has been moved or does not exist. Choose where you would like to go next:
          </p>
        </div>

        {/* Quick Recovery Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <Link
            href="/app"
            className="p-5 rounded-2xl border border-white/10 bg-[#111c2e]/90 hover:border-[#54d6c7]/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54d6c7]/15 text-[#54d6c7] group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#54d6c7] group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-sm font-bold text-white">Student Workspace</h2>
            <p className="text-xs text-slate-400 pt-1">Return to your dashboard, active study schedule, and daily tasks.</p>
          </Link>

          <Link
            href="/plan"
            className="p-5 rounded-2xl border border-white/10 bg-[#111c2e]/90 hover:border-[#8b5cf6]/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8b5cf6]/15 text-[#8b5cf6] group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#8b5cf6] group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-sm font-bold text-white">Study Plan &amp; Syllabus</h2>
            <p className="text-xs text-slate-400 pt-1">View your exam countdown, 5-unit blueprint, and calibrated roadmap.</p>
          </Link>

          <Link
            href="/app?tab=practice"
            className="p-5 rounded-2xl border border-white/10 bg-[#111c2e]/90 hover:border-[#70d6a8]/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#70d6a8]/15 text-[#70d6a8] group-hover:scale-105 transition-transform">
                <Award className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#70d6a8] group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-sm font-bold text-white">Practice 3M/7M/10M</h2>
            <p className="text-xs text-slate-400 pt-1">Drill university-pattern questions with instant marking rubrics.</p>
          </Link>

          <Link
            href="/app?tab=nexa"
            className="p-5 rounded-2xl border border-white/10 bg-[#111c2e]/90 hover:border-[#54d6c7]/50 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#54d6c7]/15 text-[#54d6c7] group-hover:scale-105 transition-transform">
                <Bot className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#54d6c7] group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-sm font-bold text-white">Ask Nexa AI Tutor</h2>
            <p className="text-xs text-slate-400 pt-1">Get immediate concept explanations, analogies, and derivations.</p>
          </Link>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Landing Page</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-[#0b1220]/90 py-6 px-4 text-center text-xs text-slate-400">
        <p>© 2026 ScholarMate AI • Department of AI &amp; ML, AANM &amp; VVRSR Polytechnic</p>
      </footer>
    </div>
  );
}
