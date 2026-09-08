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
  GraduationCap,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveStudyScene from './InteractiveStudyScene';

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
  const [activeTabDemo, setActiveTabDemo] = useState<'sampleAnswer' | 'samplePlan' | 'sampleRubric'>('sampleAnswer');

  // Stored or default student exam plan
  const [studentPlan, setStudentPlan] = useState({
    subject: 'Operating Systems & System Software',
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
      {/* 1. Futuristic 3D Hero Workspace Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111c2e]/95 via-[#0b1220] to-[#17253a]/90 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl">
        {/* Soft Refractive Glows */}
        <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full bg-[#54d6c7]/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-24 w-80 h-80 rounded-full bg-[#8b5cf6]/10 blur-[110px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#54d6c7]/30 bg-[#54d6c7]/10 px-3.5 py-1 text-xs font-bold text-[#54d6c7]">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Interactive 3D Exam Preparation System</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Turn your syllabus into a{' '}
              <span className="bg-gradient-to-r from-[#54d6c7] via-[#70d6a8] to-[#8b5cf6] bg-clip-text text-transparent">
                personalized exam plan.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Upload your notes and past papers. ScholarMate teaches difficult topics, creates exam-ready answers, and tracks your preparation automatically.
            </p>

            {/* Dominant Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => setActiveTab('library')}
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-7 py-3.5 text-xs sm:text-sm shadow-xl shadow-[#54d6c7]/25 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload Your Syllabus</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3.5 text-xs sm:text-sm transition-all cursor-pointer"
              >
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* AI Search Query Input */}
            <form onSubmit={handleSearch} className="pt-2 max-w-lg">
              <div className="relative flex items-center rounded-2xl border border-white/10 bg-[#0b1220]/90 px-4 py-2.5 shadow-lg focus-within:border-[#54d6c7]">
                <Search className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="Ask Nexa AI any formula, concept, or theorem..."
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

          {/* Right Interactive 3D Canvas Scene (5 Cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <InteractiveStudyScene />
          </div>
        </div>
      </section>

      {/* 2. Active Learning Queue & Target Exam Schedule */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Learning Queue with Layered Study Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Learning Queue
            </h2>
            <span className="text-xs text-[#54d6c7] font-semibold">Priority Mission</span>
          </div>

          {/* Layered Primary Study Card with subtle tilt */}
          <div className="rounded-3xl border border-[#54d6c7]/30 bg-gradient-to-br from-[#17253a] to-[#111c2e] p-6 sm:p-7 shadow-xl space-y-5 transition-transform hover:-translate-y-1">
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

            <div className="rounded-2xl border border-white/5 bg-[#0b1220]/70 p-4 space-y-2">
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

          {/* Secondary Layered Tasks */}
          <div className="space-y-2.5">
            {secondaryMissions.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveTab(m.tab)}
                className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#111c2e]/90 hover:bg-[#17253a] hover:border-[#54d6c7]/30 transition-all cursor-pointer"
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

        {/* Right Column: Target Exam Schedule & Transparent Readiness Breakdown (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Exam Countdown Module */}
          <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#f6c85f]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Exam Schedule
                </h3>
              </div>
              <span className="rounded-full bg-[#f6c85f]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#f6c85f] border border-[#f6c85f]/30">
                {studentPlan.daysRemaining} Days Remaining
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-white">
                {studentPlan.subject}
              </h4>
              <p className="text-xs text-slate-400">Target Date: {studentPlan.examDate} · Target Score: {studentPlan.targetScore}%</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-white/5 p-3 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400">Remaining Topics</span>
                <div className="text-sm font-extrabold text-white">{studentPlan.topicsRemaining} topics left</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400">Daily Study Time</span>
                <div className="text-xs font-bold text-[#54d6c7] leading-tight">
                  Rec: {studentPlan.recommendedHoursPerDay}/day
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Exam Readiness Breakdown */}
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

            <div className="space-y-2.5 text-xs">
              {[
                { label: "Syllabus coverage", val: 78, color: "bg-[#54d6c7]" },
                { label: "Concept mastery", val: 64, color: "bg-[#8b5cf6]" },
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

            <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-3.5 text-xs text-slate-300 space-y-1">
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

      {/* 3. Three-Step Workflow: Upload -> Nexa AI -> Practice */}
      <section id="how-it-works-section" className="space-y-6 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How ScholarMate Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A 3-step academic workflow converting raw syllabus PDFs into personalized exam readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Upload Syllabus & Notes",
              desc: "Drag & drop PDF textbooks, handwritten notes, or past question papers.",
              icon: UploadCloud,
              tag: "Ingestion"
            },
            {
              step: "02",
              title: "Nexa AI Teaches & Formats",
              desc: "Structures 10-mark model answers, formulas, diagrams, and examiner rubrics.",
              icon: Bot,
              tag: "Synthesis"
            },
            {
              step: "03",
              title: "Practice & Master Readiness",
              desc: "Drill 15-question banks, take timed mock simulators, and track your readiness curve.",
              icon: Award,
              tag: "Mastery"
            }
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 space-y-4 relative shadow-lg hover:border-[#54d6c7]/40 transition-all hover:-translate-y-1"
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

      {/* 4. Sample AI-Generated Exam Answer & Marking Rubrics */}
      <section className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white">
              Sample AI-Generated Exam Answers & Marking Rubrics
            </h3>
            <p className="text-xs text-slate-400">
              Exam-ready model answers calibrated to university evaluation standards.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 text-xs font-bold">
            <button
              onClick={() => setActiveTabDemo('sampleAnswer')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabDemo === 'sampleAnswer' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              10-Mark Model Answer
            </button>
            <button
              onClick={() => setActiveTabDemo('sampleRubric')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTabDemo === 'sampleRubric' ? 'bg-[#54d6c7] text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Examiner Marking Scheme
            </button>
          </div>
        </div>

        {activeTabDemo === 'sampleAnswer' && (
          <div className="space-y-3 rounded-2xl bg-[#0b1220] p-5 border border-white/5 font-sans text-xs sm:text-sm">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="font-bold text-[#54d6c7]">Q: Explain Banker's Algorithm with Resource Allocation Graph & Safety Check</span>
              <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px]">10 Marks</span>
            </div>
            <div className="space-y-2 text-slate-300 leading-relaxed">
              <p><strong>1. Core Principle:</strong> A deadlock avoidance algorithm testing for safe states by simulating maximum possible resource requests.</p>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 font-mono text-[11px] text-[#70d6a8]">
                Need[i][j] = Max[i][j] - Allocation[i][j]<br />
                Work = Available<br />
                Safety Condition: If Need[i] &lt;= Work -&gt; Work += Allocation[i]; Finish[i] = True
              </div>
              <p><strong>2. Solved Step-by-Step Logic:</strong> 5 processes with 3 resource types A, B, C. System produces safe sequence &lt;P1, P3, P4, P0, P2&gt;.</p>
            </div>
          </div>
        )}

        {activeTabDemo === 'sampleRubric' && (
          <div className="space-y-2 text-xs">
            {[
              { criterion: "Definition & Formal Safety Criteria", marks: "2 Marks", desc: "Define safe state, Need vector calculation, and state invariance." },
              { criterion: "Step-by-Step Safety Algorithm Working", marks: "4 Marks", desc: "Detailed pseudo-code / step-by-step vector iteration logic." },
              { criterion: "Solved Numerical Example with Matrices", marks: "3 Marks", desc: "Complete Allocation, Max, Available, and Need matrix table." },
              { criterion: "Boxed Final Safe Sequence & Presentation", marks: "1 Mark", desc: "Highlighted safe sequence box & examiner summary." }
            ].map((r, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#0b1220] border border-white/5">
                <div>
                  <span className="font-bold text-white">{r.criterion}</span>
                  <p className="text-[11px] text-slate-400">{r.desc}</p>
                </div>
                <span className="font-mono font-bold text-[#54d6c7] shrink-0 ml-3">{r.marks}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. College Attribution & Full Team Profiles */}
      <section className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#54d6c7]">
            <GraduationCap className="h-4 w-4" />
            <span>Institutional Final-Year Major Project</span>
          </div>
          <h3 className="text-lg font-extrabold text-white">
            About ScholarMate & Project Team
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            ScholarMate is a final-year AI and ML engineering major project developed by students of <strong>AANM & VVRSR Polytechnic College</strong> (Department of Computer Engineering).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Vastav", role: "Lead Architect", sub: "AI Engine & Full-Stack Systems" },
            { name: "Vishnu", role: "3D Graphics", sub: "Interactive 3D & UI/UX" },
            { name: "Nikhileswar", role: "Backend Architect", sub: "Prisma, Database & Security" },
            { name: "Sathvik", role: "Active Recall Lead", sub: "Spaced Repetition & SM-2 Algorithmic Memory" }
          ].map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-white/5 bg-[#0b1220] p-4 space-y-1.5 hover:border-[#54d6c7]/30 transition-all"
            >
              <div className="text-sm font-extrabold text-white">{member.name}</div>
              <div className="text-xs font-bold text-[#54d6c7]">{member.role}</div>
              <div className="text-[11px] text-slate-400">{member.sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
