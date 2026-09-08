'use client';

import React, { useState, useEffect } from 'react';
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
  Bot,
  Check,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  UploadCloud,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardViewProps {
  user: any;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenEmergencyModal?: () => void;
  onOpenOnboarding?: () => void;
  onSelectTopic?: (topic: string, subject?: string) => void;
  theme?: 'dark' | 'light';
}

export default function DashboardView({
  user,
  setActiveTab,
  onOpenAuth,
  onOpenEmergencyModal,
  onOpenOnboarding,
  onSelectTopic,
}: DashboardViewProps) {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [activeTabDemo, setActiveTabDemo] = useState<'sampleAnswer' | 'samplePlan' | 'sampleMock'>('sampleAnswer');

  // Stored or default student exam plan
  const [studentPlan, setStudentPlan] = useState({
    subject: 'Operating Systems & Machine Learning',
    examDate: '2026-10-15',
    daysRemaining: 7,
    topicsRemaining: 18,
    recommendedHoursPerDay: '2 hours 20 minutes',
    targetScore: 90
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('scholarmate_student_plan');
      if (stored) {
        const parsed = JSON.parse(stored);
        setStudentPlan(prev => ({
          ...prev,
          subject: parsed.subjects ? parsed.subjects[0] : prev.subject,
          examDate: parsed.examDate || prev.examDate,
          recommendedHoursPerDay: parsed.recommendedHoursPerDay || prev.recommendedHoursPerDay,
          targetScore: parsed.targetScore || prev.targetScore
        }));
      }
    } catch (e) {}
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPrompt.trim()) {
      if (onSelectTopic) onSelectTopic(quickPrompt, studentPlan.subject);
      setActiveTab('nexa');
    }
  };

  const secondaryMissions = [
    {
      id: 'm2',
      title: 'Practice 5-Mark Question: Process State Transitions',
      subject: 'Operating Systems',
      duration: '10 mins',
      tab: 'practice',
      badge: 'Examiner Favorite'
    },
    {
      id: 'm3',
      title: 'Review 12 Due Flashcards (Active Recall)',
      subject: 'Computer Networks',
      duration: '8 mins',
      tab: 'flashcards',
      badge: 'Spaced Repetition'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111c2e]/95 via-[#0b1220] to-[#17253a]/80 p-8 sm:p-14 shadow-2xl backdrop-blur-2xl">
        {/* Atmospheric Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#54d6c7]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-24 w-80 h-80 rounded-full bg-[#6ea8fe]/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#54d6c7]/25 bg-[#54d6c7]/10 px-3.5 py-1 text-xs font-bold text-[#54d6c7]">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>AI-Powered Exam Preparation System</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Turn your syllabus into a{' '}
            <span className="bg-gradient-to-r from-[#54d6c7] via-[#70d6a8] to-[#6ea8fe] bg-clip-text text-transparent">
              personalized exam plan.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Upload your notes and past papers. ScholarMate teaches difficult topics, creates exam-ready answers, and tracks your preparation automatically.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('library')}
              className="flex items-center gap-2 rounded-2xl bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-black px-7 py-3.5 text-sm shadow-xl shadow-[#54d6c7]/25 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <span>Start Studying</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('how-it-works-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3.5 text-sm transition-all cursor-pointer"
            >
              <span>See How It Works</span>
            </button>
          </div>

          {/* Quick AI Search Bar */}
          <form onSubmit={handleSearch} className="pt-4 max-w-xl">
            <div className="relative flex items-center rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2.5 shadow-lg focus-within:border-[#54d6c7]">
              <Search className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Ask Nexa any engineering concept or formula..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="ml-2 flex items-center gap-1 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] px-3.5 py-1.5 text-xs font-black text-slate-950 transition-all cursor-pointer shrink-0"
              >
                <span>Ask AI</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Action-Oriented Dashboard Modules: Continue Preparation & Exam Countdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Continue Preparation Major Module (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Active Learning Queue
            </h2>
            <span className="text-xs text-[#54d6c7] font-semibold">Mission 1 of 3</span>
          </div>

          {/* Large Hero Mission Card */}
          <div className="rounded-3xl border border-[#54d6c7]/30 bg-gradient-to-br from-[#17253a] to-[#111c2e] p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#54d6c7]/15 text-[#54d6c7] border border-[#54d6c7]/30">
                  Priority 10-Mark Goal
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Continue your preparation
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#54d6c7]/15 text-[#54d6c7]">
                <Zap className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0b1220]/60 p-4 space-y-2">
              <h4 className="text-sm sm:text-base font-bold text-white">
                Master Banker’s Algorithm Safety Check
              </h4>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="font-medium text-slate-300">Operating Systems</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#54d6c7]" />
                  <span>15 minutes</span>
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  if (onSelectTopic) onSelectTopic("Banker's Algorithm Safety Check", "Operating Systems");
                  setActiveTab('practice');
                }}
                className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-black px-6 py-3 text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Start Mission</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setActiveTab('exam_center')}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                View Full Syllabus →
              </button>
            </div>
          </div>

          {/* Smaller Secondary Tasks Below */}
          <div className="space-y-2.5">
            {secondaryMissions.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveTab(m.tab)}
                className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#111c2e]/80 hover:bg-[#17253a] transition-all cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{m.title}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-white/5 text-slate-400 font-medium">
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{m.subject} · {m.duration}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Exam Countdown & Transparent Readiness Score (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Exam Countdown Card */}
          <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#f6c85f]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Exam Schedule
                </h3>
              </div>
              <span className="rounded-full bg-[#f6c85f]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#f6c85f] border border-[#f6c85f]/30">
                {studentPlan.daysRemaining} Days Left
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-white">
                {studentPlan.subject}
              </h4>
              <p className="text-xs text-slate-400">Target Date: {studentPlan.examDate} · Goal: {studentPlan.targetScore}%</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-white/5 p-3 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400">Remaining Topics</span>
                <div className="text-sm font-extrabold text-white">{studentPlan.topicsRemaining} topics left</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400">Daily Study Pace</span>
                <div className="text-xs font-bold text-[#54d6c7] leading-tight">
                  Rec: {studentPlan.recommendedHoursPerDay}/day
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Readiness Breakdown Card */}
          <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#54d6c7]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Exam Readiness Breakdown
                </h3>
              </div>
              <span className="text-sm font-black text-[#54d6c7]">78% Overall</span>
            </div>

            {/* 5-Metric Breakdown */}
            <div className="space-y-2.5 text-xs">
              {[
                { label: "Syllabus coverage", val: 78, color: "bg-[#54d6c7]" },
                { label: "Concept mastery", val: 64, color: "bg-[#6ea8fe]" },
                { label: "Practice accuracy", val: 81, color: "bg-[#70d6a8]" },
                { label: "Mock exam score", val: 69, color: "bg-[#f6c85f]" },
                { label: "Flashcard retention", val: 75, color: "bg-[#54d6c7]" }
              ].map((metric) => (
                <div key={metric.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-slate-300">{metric.label}</span>
                    <span className="text-white font-bold">{metric.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${metric.val}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Explanatory Trust Insight Box */}
            <div className="rounded-2xl border border-white/5 bg-slate-900/90 p-3.5 text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#f6c85f] text-[11px]">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Diagnostic Assessment</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                You are likely ready for short-answer questions, but need more practice with long-answer questions and Operating Systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How ScholarMate Works (3-Step Pipeline) */}
      <section id="how-it-works-section" className="space-y-6 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How ScholarMate Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A seamless academic operating pipeline designed to take you from raw textbook PDFs to exam day distinction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Upload Syllabus & Notes",
              desc: "Drag and drop your university syllabus, textbook PDFs, or past question papers.",
              icon: UploadCloud,
              tag: "Ingestion"
            },
            {
              step: "02",
              title: "Nexa AI Teaches & Formats",
              desc: "Generates plain-English concept lessons, derivations, and examiner marking rubrics.",
              icon: Bot,
              tag: "Synthesis"
            },
            {
              step: "03",
              title: "Practice & Master Readiness",
              desc: "Drill 15-question banks, take timed mock exams, and reinforce formulas with active recall.",
              icon: Award,
              tag: "Mastery"
            }
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 space-y-4 relative shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#54d6c7] font-mono">{s.step}</span>
                  <div className="p-3 rounded-2xl bg-white/5 text-[#54d6c7]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Trust-Building Sample Outcomes Demo */}
      <section className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Sample AI Exam Generation Preview
            </h3>
            <p className="text-xs text-slate-400">
              Inspect how ScholarMate outputs university-standard model answers and rubrics.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 text-xs font-bold">
            <button
              onClick={() => setActiveTabDemo('sampleAnswer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabDemo === 'sampleAnswer' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              10-Mark Answer
            </button>
            <button
              onClick={() => setActiveTabDemo('samplePlan')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabDemo === 'samplePlan' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              5-Unit Blueprint
            </button>
          </div>
        </div>

        {activeTabDemo === 'sampleAnswer' && (
          <div className="space-y-3 rounded-2xl bg-[#0b1220] p-5 border border-white/5 font-sans text-xs sm:text-sm">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="font-bold text-[#54d6c7]">Q: Explain Banker's Algorithm with Safety Condition</span>
              <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px]">10 Marks</span>
            </div>
            <div className="space-y-2 text-slate-300 leading-relaxed">
              <p><strong>1. Principle:</strong> Deadlock avoidance algorithm testing for safe states by simulating maximum possible allocation for all processes.</p>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 font-mono text-[11px] text-[#70d6a8]">
                Need[i][j] = Max[i][j] - Allocation[i][j]<br />
                Work = Available<br />
                Condition: If Need[i] &lt;= Work -&gt; Work += Allocation[i]
              </div>
              <p><strong>2. Examiner Marking Checkpoints:</strong> Definition (2M) · Matrix Derivation (4M) · Numerical Example (3M) · Boxed Output (1M).</p>
            </div>
          </div>
        )}

        {activeTabDemo === 'samplePlan' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#0b1220] border border-white/5 space-y-1">
              <span className="font-bold text-[#54d6c7]">Unit 1: Process Scheduling</span>
              <p className="text-slate-400 text-[11px]">Weightage: 25% · 5 Topics</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b1220] border border-white/5 space-y-1">
              <span className="font-bold text-[#54d6c7]">Unit 2: Deadlocks & Prevention</span>
              <p className="text-slate-400 text-[11px]">Weightage: 20% · 4 Topics</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#0b1220] border border-white/5 space-y-1">
              <span className="font-bold text-[#54d6c7]">Unit 3: Memory & Virtual Paging</span>
              <p className="text-slate-400 text-[11px]">Weightage: 30% · 6 Topics</p>
            </div>
          </div>
        )}
      </section>

      {/* 5. Institutional Project & Team Section (Lower on page) */}
      <section className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#54d6c7]">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Engineering Project</span>
          </div>
          <h3 className="text-lg font-extrabold text-white">
            About ScholarMate & Project Team
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            ScholarMate is a final-year AI and ML project developed by students of <strong>AANM & VVRSR Polytechnic College</strong> (Department of Computer Engineering).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: "Vastav", role: "Lead Architect", sub: "AI & Full-Stack Systems" },
            { name: "Vishnu", role: "3D Graphics", sub: "Visual Design & UI/UX" },
            { name: "Nikhileswar", role: "Backend Architect", sub: "Database & Security" },
            { name: "Sathvik", role: "Active Recall", sub: "Spaced Repetition & SM-2" }
          ].map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-white/5 bg-[#0b1220] p-4 space-y-1"
            >
              <div className="text-xs font-extrabold text-white">{member.name}</div>
              <div className="text-[11px] font-bold text-[#54d6c7]">{member.role}</div>
              <div className="text-[10px] text-slate-400">{member.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
