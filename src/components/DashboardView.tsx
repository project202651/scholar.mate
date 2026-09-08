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
  Play,
  RotateCcw,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
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
    branch: 'Computer Engineering',
    semester: '6th Semester',
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
          branch: parsed.branch || prev.branch,
          semester: parsed.semester || prev.semester,
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

  return (
    <div className="space-y-12 pb-24">
      {/* 1. Hero Command Center with 3D Study Scene */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111c2e]/95 via-[#0b1220] to-[#17253a]/90 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl">
        <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full bg-[#54d6c7]/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mb-24 w-80 h-80 rounded-full bg-[#8b5cf6]/10 blur-[110px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#54d6c7]/30 bg-[#54d6c7]/10 px-3.5 py-1 text-xs font-bold text-[#54d6c7]">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>Personalized AI Exam Operating System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Turn your syllabus into a{' '}
              <span className="bg-gradient-to-r from-[#54d6c7] via-[#70d6a8] to-[#8b5cf6] bg-clip-text text-transparent">
                personalized exam plan.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Upload your notes and past papers. ScholarMate teaches difficult topics, creates exam-ready answers, and tracks your preparation automatically.
            </p>

            {/* Dominant Primary Action: Build My Study Plan */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => {
                  if (onOpenOnboarding) onOpenOnboarding();
                  else setActiveTab('library');
                }}
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-7 py-3.5 text-xs sm:text-sm shadow-xl shadow-[#54d6c7]/25 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Build My Study Plan</span>
              </button>

              <button
                onClick={() => setActiveTab('library')}
                className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3.5 text-xs sm:text-sm transition-all cursor-pointer"
              >
                <UploadCloud className="h-4 w-4 text-[#54d6c7]" />
                <span>Upload Notes & Papers</span>
              </button>
            </div>

            {/* Quick Concept AI Query */}
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

          {/* 3D Interactive Scene */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <InteractiveStudyScene />
          </div>
        </div>
      </section>

      {/* 2. Today's Guided Study Plan (Section 1) & Exam Readiness (Section 2) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section 1: Today's Study Plan (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#54d6c7]" />
                <span>Today’s Study Plan</span>
              </h2>
              <p className="text-[11px] text-slate-400">Complete 3 tasks in 45 minutes to maintain your streak</p>
            </div>
            <span className="rounded-full bg-[#54d6c7]/15 px-3 py-0.5 text-xs font-bold text-[#54d6c7]">
              45 Mins Total
            </span>
          </div>

          {/* Primary Task 1 Hero Card with 'Start Session' */}
          <div className="rounded-3xl border border-[#54d6c7]/30 bg-gradient-to-br from-[#17253a] to-[#111c2e] p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#54d6c7]/15 text-[#54d6c7] border border-[#54d6c7]/30">
                  Task 1 of 3 · High-Yield 10M
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Master Banker’s Algorithm Safety Check
                </h3>
                <p className="text-xs text-slate-300">
                  Operating Systems · Unit 2 Deadlocks · 15 minutes
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#54d6c7]/15 text-[#54d6c7] shrink-0">
                <Zap className="h-5 w-5" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  if (onSelectTopic) onSelectTopic("Banker's Algorithm Safety Check", "Operating Systems");
                  setActiveTab('practice');
                }}
                className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-black px-7 py-3 text-xs sm:text-sm shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
              >
                <span>Start Session</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setActiveTab('exam_center')}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                View Syllabus Blueprint →
              </button>
            </div>
          </div>

          {/* Secondary Tasks (Task 2 & Task 3) */}
          <div className="space-y-2.5">
            <div
              onClick={() => setActiveTab('flashcards')}
              className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#111c2e] hover:bg-[#17253a] hover:border-[#54d6c7]/30 transition-all cursor-pointer"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Task 2: Review 12 Due Flashcards (Active Recall)</span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-[#8b5cf6]/20 text-[#8b5cf6] font-bold">
                    Spaced Repetition
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Computer Networks · 10 minutes</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </div>

            <div
              onClick={() => setActiveTab('practice')}
              className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#111c2e] hover:bg-[#17253a] hover:border-[#54d6c7]/30 transition-all cursor-pointer"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Task 3: Practice Question: Gantt Chart Scheduling</span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-[#70d6a8]/20 text-[#70d6a8] font-bold">
                    5-Mark Drill
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Operating Systems · 10 minutes</p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Section 2: Exam Readiness & Diagnostics (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#54d6c7]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Exam Readiness Breakdown
                </h3>
              </div>
              <span className="text-sm font-black text-[#54d6c7]">78% Overall</span>
            </div>

            {/* Readiness by Subject */}
            <div className="space-y-2.5 text-xs">
              {[
                { sub: "Operating Systems", score: 82, color: "bg-[#54d6c7]" },
                { sub: "Database Systems", score: 88, color: "bg-[#70d6a8]" },
                { sub: "Data Structures", score: 76, color: "bg-[#6ea8fe]" },
                { sub: "Computer Networks", score: 65, color: "bg-[#f6c85f]" }
              ].map((s) => (
                <div key={s.sub} className="space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">{s.sub}</span>
                    <span className="text-white font-bold">{s.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnostic Alert Box */}
            <div className="rounded-2xl border border-white/5 bg-[#0b1220] p-3.5 text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-[#f47c7c]">⚠️ Weakest Unit: Unit 2 Deadlocks</span>
                <span className="text-[#f6c85f]">{studentPlan.daysRemaining} Days to Exam</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                You are likely ready for short-answer questions, but need more practice with long-answer questions and Operating Systems.
              </p>
            </div>
          </div>

          {/* Quick Actions Panel (Section 5) */}
          <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('library')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 transition-all cursor-pointer text-left"
              >
                <UploadCloud className="h-4 w-4 text-[#54d6c7]" />
                <span>Upload Material</span>
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 transition-all cursor-pointer text-left"
              >
                <BookOpen className="h-4 w-4 text-[#6ea8fe]" />
                <span>Generate Notes</span>
              </button>
              <button
                onClick={() => setActiveTab('mock_exams')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 transition-all cursor-pointer text-left"
              >
                <Award className="h-4 w-4 text-[#f6c85f]" />
                <span>Start Mock Test</span>
              </button>
              <button
                onClick={() => setActiveTab('nexa')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-200 transition-all cursor-pointer text-left"
              >
                <Bot className="h-4 w-4 text-[#70d6a8]" />
                <span>Ask Nexa AI</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Continue Learning & Review Due Today Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Continue Learning (Section 3) */}
        <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#54d6c7]" />
              <h3 className="text-sm font-bold text-white">Continue Learning</h3>
            </div>
            <span className="text-xs text-slate-400">Resume Recent</span>
          </div>

          <div
            onClick={() => setActiveTab('library')}
            className="p-4 rounded-2xl border border-white/5 bg-[#0b1220] hover:border-[#54d6c7]/40 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Operating Systems: Memory Management & Paging</span>
              <span className="text-[10px] text-[#54d6c7] font-bold">In Progress</span>
            </div>
            <p className="text-[11px] text-slate-400">Unit 3 · 6 summary sections synthesized · 10 practice cards</p>
            <div className="flex justify-end pt-1">
              <span className="text-xs font-bold text-[#54d6c7] flex items-center gap-1">
                <span>Resume Note</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Review Due Today (Section 4) */}
        <div className="rounded-3xl border border-white/10 bg-[#111c2e] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#8b5cf6]" />
              <h3 className="text-sm font-bold text-white">Review Due Today</h3>
            </div>
            <span className="text-xs font-bold text-[#8b5cf6]">12 Flashcards</span>
          </div>

          <div
            onClick={() => setActiveTab('flashcards')}
            className="p-4 rounded-2xl border border-white/5 bg-[#0b1220] hover:border-[#8b5cf6]/40 transition-all cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Spaced Repetition Review Queue</span>
              <span className="text-[10px] text-[#8b5cf6] font-bold">SM-2 Algorithm</span>
            </div>
            <p className="text-[11px] text-slate-400">Reinforce formulas and definitions before forgetfulness curve drop-off.</p>
            <div className="flex justify-end pt-1">
              <span className="text-xs font-bold text-[#8b5cf6] flex items-center gap-1">
                <span>Drill Flashcards</span>
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Three-Step Workflow: Upload -> Nexa AI -> Practice */}
      <section id="how-it-works-section" className="space-y-6 pt-2">
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

      {/* 5. Sample AI-Generated Exam Answer & Marking Rubrics */}
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

      {/* 6. College Attribution & Full Team Profiles */}
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
