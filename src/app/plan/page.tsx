'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Target,
  FileCheck2,
  TrendingUp,
  Layers,
  Bot,
  Flame,
  ChevronRight,
  Sun,
  Moon,
  Plus,
  RotateCcw,
  Check,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import ThreeBackground from '@/components/ThreeBackground';
import OnboardingModal from '@/components/OnboardingModal';

interface Task {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  marksCategory: string;
  actionTab: string;
  topicParam: string;
  completed: boolean;
}

export default function StudyPlanPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<number>(1);

  // Student plan configuration
  const [plan, setPlan] = useState({
    branch: 'Artificial Intelligence & Machine Learning',
    examName: 'Semester End University Examination',
    subjects: [
      'Operating Systems & System Software',
      'Data Structures & Algorithms',
      'Artificial Intelligence & Machine Learning'
    ],
    selectedSubject: 'Operating Systems & System Software',
    examDate: '2026-10-15',
    daysRemaining: 18,
    targetGrade: 'Distinction (85-95%)',
    targetScore: 90,
    dailyHours: 2.5,
    confidenceMap: {
      'Operating Systems & System Software': 'medium',
      'Data Structures & Algorithms': 'low',
      'Artificial Intelligence & Machine Learning': 'high'
    } as Record<string, 'low' | 'medium' | 'high'>
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 't1',
      title: 'Master Banker\'s Algorithm & Deadlock Avoidance',
      subject: 'Operating Systems',
      durationMinutes: 15,
      marksCategory: '10-Mark Core Derivation',
      actionTab: 'nexa',
      topicParam: 'Banker\'s Algorithm for Deadlock Avoidance',
      completed: true
    },
    {
      id: 't2',
      title: 'Review 12 Spaced Flashcards: Paging, TLB & Effective Access Time',
      subject: 'Operating Systems',
      durationMinutes: 10,
      marksCategory: 'Active Recall',
      actionTab: 'flashcards',
      topicParam: 'Paging, Segmentation & TLB Effective Access Time',
      completed: false
    },
    {
      id: 't3',
      title: 'Practice 7-Mark Question: Gantt Chart CPU Scheduling',
      subject: 'Operating Systems',
      durationMinutes: 12,
      marksCategory: '7-Mark Drill',
      actionTab: 'practice',
      topicParam: 'CPU Scheduling (Round Robin & Priority)',
      completed: false
    },
    {
      id: 't4',
      title: 'Repair High-Risk Weakness: Semaphore Implementation & Dining Philosophers',
      subject: 'Operating Systems',
      durationMinutes: 15,
      marksCategory: 'Weakness Repair',
      actionTab: 'nexa',
      topicParam: 'Process Synchronization & Semaphores',
      completed: false
    }
  ]);

  // 5 Units of standard university syllabus
  const units = [
    {
      unitNum: 1,
      title: 'OS Overview & Process Management',
      marksWeight: '18 Marks (2x 3M, 1x 10M)',
      readiness: 85,
      highYieldTopics: ['Dual-mode CPU operation', 'Process Control Block (PCB)', 'Context Switching']
    },
    {
      unitNum: 2,
      title: 'CPU Scheduling & Deadlocks',
      marksWeight: '22 Marks (1x 3M, 1x 7M, 1x 10M)',
      readiness: 65,
      highYieldTopics: ['Banker\'s Algorithm Safety', 'Round-Robin Gantt Chart', '4 Deadlock Conditions']
    },
    {
      unitNum: 3,
      title: 'Memory Management & Virtual Memory',
      marksWeight: '20 Marks (2x 3M, 1x 7M, 1x 7M)',
      readiness: 45,
      highYieldTopics: ['Paging vs Segmentation', 'TLB Hit Ratio & EAT', 'Page Replacement (FIFO, LRU, Optimal)']
    },
    {
      unitNum: 4,
      title: 'Storage & File System Interface',
      marksWeight: '16 Marks (2x 3M, 1x 10M)',
      readiness: 30,
      highYieldTopics: ['Disk Scheduling (SSTF, SCAN, C-LOOK)', 'Indexed Allocation', 'Directory Structures']
    },
    {
      unitNum: 5,
      title: 'I/O Systems & Protection Mechanisms',
      marksWeight: '14 Marks (1x 3M, 1x 7M)',
      readiness: 20,
      highYieldTopics: ['DMA Controller Signal Flow', 'Access Matrix Model', 'Security Policies']
    }
  ];

  // Hydrate user plan from localStorage or DB
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('scholarmate_theme') as 'dark' | 'light' | null;
      if (savedTheme) setTheme(savedTheme);

      const stored = localStorage.getItem('scholarmate_student_plan');
      if (stored) {
        const parsed = JSON.parse(stored);
        let days = 18;
        if (parsed.examDate) {
          const diff = Math.ceil((new Date(parsed.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          days = diff > 0 ? diff : 7;
        }
        setPlan(prev => ({
          ...prev,
          branch: parsed.branch || prev.branch,
          examName: parsed.examName || prev.examName,
          subjects: parsed.subjects && parsed.subjects.length > 0 ? parsed.subjects : prev.subjects,
          selectedSubject: parsed.subjects && parsed.subjects.length > 0 ? parsed.subjects[0] : prev.selectedSubject,
          examDate: parsed.examDate || prev.examDate,
          daysRemaining: days,
          targetGrade: parsed.targetGrade || prev.targetGrade,
          targetScore: parsed.targetScore || prev.targetScore,
          dailyHours: parsed.dailyHours ? parseFloat(parsed.dailyHours) : prev.dailyHours,
          confidenceMap: parsed.confidenceMap || prev.confidenceMap
        }));
      }

      // Fetch from API
      fetch('/api/user/plan')
        .then(res => res.json())
        .then(data => {
          if (data && data.plan) {
            const p = data.plan;
            let days = 18;
            if (p.examDate) {
              const diff = Math.ceil((new Date(p.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              days = diff > 0 ? diff : 7;
            }
            setPlan(prev => ({
              ...prev,
              branch: p.branch || prev.branch,
              examName: p.examName || prev.examName,
              subjects: p.subjects && p.subjects.length > 0 ? p.subjects : prev.subjects,
              selectedSubject: p.subjects && p.subjects.length > 0 ? p.subjects[0] : prev.selectedSubject,
              examDate: p.examDate || prev.examDate,
              daysRemaining: days,
              targetGrade: p.targetGrade || prev.targetGrade,
              targetScore: p.targetScore || prev.targetScore,
              confidenceMap: p.confidenceMap || prev.confidenceMap
            }));
          }
        })
        .catch(() => {});
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('scholarmate_theme', next);
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        if (next === 'light') {
          root.classList.remove('dark');
          root.classList.add('light');
        } else {
          root.classList.remove('light');
          root.classList.add('dark');
        }
      }
    } catch (e) {}
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div
      className={`relative min-h-screen font-sans antialiased selection:bg-[#54d6c7] selection:text-slate-950 ${
        theme === 'dark' ? 'bg-[#0b1220] text-[#f5f7fb]' : 'bg-[#f8fafc] text-[#0f172a]'
      }`}
    >
      <ThreeBackground theme={theme} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-xl px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#54d6c7] to-[#8b5cf6] text-slate-950 shadow-lg shadow-[#54d6c7]/20">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">ScholarMate</span>
                <span className="rounded-full bg-[#54d6c7]/15 px-2 py-0.5 text-[10px] font-bold text-[#54d6c7] border border-[#54d6c7]/30">
                  Study Plan
                </span>
              </div>
              <span className="block text-[10px] text-slate-400 font-medium">Calibrated Syllabus Roadmap</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-[#54d6c7]" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>

            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#54d6c7]" />
              <span>Recalibrate Plan</span>
            </button>

            <Link
              href="/app"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#54d6c7] to-[#2dd4bf] hover:opacity-95 text-slate-950 font-black px-4 sm:px-5 py-2 text-xs shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Roadmap Cockpit */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8 pb-24">
        {/* Sample Plan Notice & Auth CTA Banner */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#111c2e] to-[#54d6c7]/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-lg">
          <div className="flex items-center gap-3 text-slate-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 shrink-0 border border-amber-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="font-bold text-white">Sample University Study Plan (Guest Preview)</p>
              <p className="text-slate-300 text-[11px]">
                Viewing calibrated 6th Sem curriculum. Click below to calibrate your own subjects or save progress to an account.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold px-3.5 py-2 text-xs transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#54d6c7]" />
              <span>Calibrate My Subjects</span>
            </button>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 rounded-xl bg-[#54d6c7] hover:bg-[#43c4b5] text-slate-950 font-black px-4 py-2 text-xs shadow-md shadow-[#54d6c7]/20 transition-all cursor-pointer"
            >
              <span>Save &amp; Sign Up</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Top Summary Banner */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111c2e] via-[#0b1220] to-[#17253a] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#54d6c7]/30 bg-[#54d6c7]/10 px-3 py-1 text-xs font-bold text-[#54d6c7]">
                <Target className="h-3.5 w-3.5" />
                <span>{plan.branch}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">
                {plan.selectedSubject}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Exam: <span className="text-white font-semibold">{plan.examName}</span> • Targeted Score:{' '}
                <span className="text-[#54d6c7] font-bold">{plan.targetScore}% ({plan.targetGrade})</span>
              </p>
            </div>

            {/* Countdown Metric Box */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0b1220]/80 px-5 py-3 text-center min-w-[110px]">
                <span className="text-3xl font-black text-[#54d6c7] font-mono">{plan.daysRemaining}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Days Remaining</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0b1220]/80 px-5 py-3 text-center min-w-[110px]">
                <span className="text-3xl font-black text-[#8b5cf6] font-mono">{plan.dailyHours}h</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Daily Target</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0b1220]/80 px-5 py-3 text-center min-w-[110px]">
                <span className="text-3xl font-black text-emerald-400 font-mono">{progressPercent}%</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Tasks Complete</span>
              </div>
            </div>
          </div>

          {/* Subject Switcher Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-xs font-bold text-slate-400 mr-2">Your Subjects:</span>
            {plan.subjects.map((sub, idx) => {
              const active = sub === plan.selectedSubject;
              const conf = plan.confidenceMap[sub] || 'medium';
              return (
                <button
                  key={idx}
                  onClick={() => setPlan(prev => ({ ...prev, selectedSubject: sub }))}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#54d6c7] text-slate-950 shadow-md shadow-[#54d6c7]/20'
                      : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{sub}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      conf === 'high'
                        ? 'bg-emerald-400'
                        : conf === 'medium'
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* 2-Column Grid: Daily Tasks (Left) & 5-Unit Syllabus Blueprint (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Today's Actionable Schedule */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#54d6c7]" />
                <h2 className="text-lg font-black text-white">Today&apos;s Focus Schedule</h2>
              </div>
              <span className="text-xs font-mono font-bold text-[#54d6c7]">
                {completedCount}/{tasks.length} Completed ({progressPercent}%)
              </span>
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    task.completed
                      ? 'border-emerald-500/30 bg-emerald-950/20 opacity-80'
                      : 'border-white/10 bg-[#111c2e]/90 hover:border-[#54d6c7]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                        task.completed
                          ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                          : 'border-white/20 bg-white/5 hover:border-[#54d6c7]'
                      }`}
                      aria-label="Toggle task completion"
                    >
                      {task.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 space-y-1">
                      <p
                        className={`text-xs sm:text-sm font-bold text-white ${
                          task.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#54d6c7] font-semibold">
                          {task.marksCategory}
                        </span>
                        <span>•</span>
                        <span>{task.durationMinutes} mins</span>
                      </div>
                    </div>

                    <Link
                      href={`/app?tab=${task.actionTab}&topic=${encodeURIComponent(task.topicParam)}`}
                      className="shrink-0 flex items-center gap-1 rounded-xl bg-white/5 hover:bg-[#54d6c7] hover:text-slate-950 text-[#54d6c7] border border-[#54d6c7]/30 px-3 py-1.5 text-xs font-bold transition-all cursor-pointer"
                    >
                      <span>Start</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Helper */}
            <div className="p-4 rounded-2xl border border-[#54d6c7]/20 bg-[#54d6c7]/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-[#54d6c7]" />
                <span className="text-xs text-slate-300">
                  Stuck on a derivation? Ask <strong>Nexa AI Coach</strong> for an instant analogy.
                </span>
              </div>
              <Link
                href="/app?tab=nexa"
                className="shrink-0 text-xs font-bold text-[#54d6c7] hover:underline flex items-center gap-1"
              >
                <span>Ask Nexa</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: 5-Unit Syllabus Blueprint */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#8b5cf6]" />
                <h2 className="text-lg font-black text-white">5-Unit Syllabus Blueprint</h2>
              </div>
              <span className="text-xs text-slate-400">University Exam Weightage</span>
            </div>

            <div className="space-y-3">
              {units.map(unit => {
                const isSelected = selectedUnit === unit.unitNum;
                return (
                  <div
                    key={unit.unitNum}
                    onClick={() => setSelectedUnit(unit.unitNum)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#8b5cf6]/50 bg-[#8b5cf6]/10'
                        : 'border-white/10 bg-[#111c2e]/70 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#8b5cf6]/20 text-[#8b5cf6] font-mono text-xs font-bold">
                          U{unit.unitNum}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white">{unit.title}</h3>
                      </div>
                      <span className="text-[10px] font-bold text-[#8b5cf6]">{unit.marksWeight}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Readiness</span>
                        <span className="font-bold text-white">{unit.readiness}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#54d6c7] to-[#8b5cf6] transition-all duration-500"
                          style={{ width: `${unit.readiness}%` }}
                        />
                      </div>
                    </div>

                    {/* High-Yield Topics */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Highest Recurring Exam Topics:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {unit.highYieldTopics.map((topic, i) => (
                            <Link
                              key={i}
                              href={`/app?tab=practice&topic=${encodeURIComponent(topic)}`}
                              className="px-2.5 py-1 rounded-lg text-[11px] bg-white/5 hover:bg-[#54d6c7] hover:text-slate-950 text-slate-300 transition-all font-medium"
                            >
                              {topic} →
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Diagnostic Action Bar */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#54d6c7]/10 via-[#111c2e] to-[#8b5cf6]/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-black text-white">
              Want to run an instant 3-mark &amp; 7-mark diagnostic test?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Simulate an authentic university paper section with instant rubric-based grading and pinpointed gap analysis.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app?tab=mock_exams"
              className="flex items-center gap-2 rounded-xl bg-[#54d6c7] hover:bg-[#41c5b6] text-slate-950 font-black px-5 py-3 text-xs shadow-lg shadow-[#54d6c7]/20 transition-all cursor-pointer"
            >
              <Award className="h-4 w-4" />
              <span>Take Timed Mock Exam</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Onboarding / Plan Recalibration Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(newPlan) => {
          setIsOnboardingOpen(false);
          let days = 18;
          if (newPlan.examDate) {
            const diff = Math.ceil((new Date(newPlan.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            days = diff > 0 ? diff : 7;
          }
          setPlan(prev => ({
            ...prev,
            branch: newPlan.branch || prev.branch,
            examName: newPlan.examName || prev.examName,
            subjects: newPlan.subjects && newPlan.subjects.length > 0 ? newPlan.subjects : prev.subjects,
            selectedSubject: newPlan.subjects && newPlan.subjects.length > 0 ? newPlan.subjects[0] : prev.selectedSubject,
            examDate: newPlan.examDate || prev.examDate,
            daysRemaining: days,
            targetGrade: newPlan.targetGrade || prev.targetGrade,
            targetScore: newPlan.targetScore || prev.targetScore,
            confidenceMap: newPlan.confidenceMap || prev.confidenceMap
          }));
        }}
      />
    </div>
  );
}
